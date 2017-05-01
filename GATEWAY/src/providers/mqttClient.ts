import { Injectable } from '@angular/core';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import { Alert, AlertController, Events } from 'ionic-angular';
import * as mqtt from 'mqtt';

import { TilesApi } from './tilesApi.service';
import { CommandObject, Device, LoginData } from './utils.service';


@Injectable()
export class MqttClient {
  public client;
  public mqttConnectionData: LoginData;
  private publishOpts = { retain: true };
  private connectionTimeout: number = 10000; // 10 seconds
  private errorAlert: Alert;

  constructor(private alertCtrl: AlertController,
              public backgroundFetch: BackgroundFetch,
              private events: Events,
              public tilesApi: TilesApi) {
    this.mqttConnectionData = this.tilesApi.getLoginData();
    this.backgroundFetch.configure({ stopOnTerminate: false })
        .then(() => {
          if (this.mqttConnectionData.user !== undefined ||
              this.mqttConnectionData.host !== undefined ||
              this.mqttConnectionData.port !== undefined ) {
            this.connect();
            this.backgroundFetch.finish();
          }
        })
        .catch(err => {
          console.log('Error initializing background fetch', err);
        });
    this.errorAlert = this.alertCtrl.create({
     buttons: [{
        text: 'Dismiss',
      }],
      enableBackdropDismiss: true,
      subTitle: 'An error occured with the mqtt client that is responsible' +
                'for sending and recieving messages to the application.' +
                'Make sure the host address and port is correct. \n',
      title: 'Mqtt error',
    });
  }

  /**
   * For testing purposes. Need the ability to set LoginData whitout being
   * dependent on the TilesApi-class
   * @param {LoginData} mqttConnectionData - the login credentials
   */
  public setConnectionData = (mqttConnectionData: LoginData = null): void => {
      this.mqttConnectionData = mqttConnectionData === null
                              ? this.tilesApi.getLoginData()
                              : this.mqttConnectionData = mqttConnectionData;
  }

  /**
   * Returns a url for the specific device
   * @param {string} deviceId - the ID of the device
   * @param {boolean} isEvent - true if we are sending an event
   */
  public getDeviceSpecificTopic = (deviceId: string, isEvent: boolean): string => {
    const type = isEvent ? 'evt' : 'cmd';
    const activeApp = this.tilesApi.getActiveApp();
    return `tiles/${type}/${this.mqttConnectionData.user}/${activeApp._id}/${deviceId}`;
  }

  /**
   * Create a connection to the server and return a javascript promise
   * @param {string} user - the user name
   * @param {string} host - the host url / ip
   * @param {number} port - the port to send to
   */
  public connect = (): void => {
    if (this.mqttConnectionData === undefined ||  this.mqttConnectionData === null) {
      this.mqttConnectionData = this.tilesApi.getLoginData();
    }

    // Check if a previous server connection exists and end it if it does
    if (this.client) {
      this.client.end();
    }

    // Instantiate a mqtt-client from the host and port
    this.client = mqtt.connect({
      host: this.mqttConnectionData.host,
      port: this.mqttConnectionData.port,
      keepalive: 0, // tslint:disable-line
    });

    // Handle events from the broker
    this.client.on('message', (topic, message) => {
      try {
        const response = JSON.parse(message);
        const command: CommandObject = new CommandObject(response.name, response.properties);
        if (command) {
          const deviceId = topic.split('/')[4];
          this.events.publish('command', deviceId, command);
        }
      } finally {} // tslint:disable-line
    });

    this.client.on('offline', () => {
      this.events.publish('offline');
    });

    this.client.on('close', () => {
      this.events.publish('close');
    });

    this.client.on('reconnect', () => {
      this.events.publish('reconnect');
    });

    this.client.on('error', error => {
      this.events.publish('error', error);
      this.errorAlert.present();
    });

    this.client.on('connect', () => {
      clearTimeout(failedConnectionTimeout);
      this.events.publish('serverConnected');
    });

    // Ends the connection attempt if the timeout rus out
    const failedConnectionTimeout = setTimeout(() => {
      if (this.client) {
        this.client.end();
      }
    }, this.connectionTimeout);
  }

  /**
   * Register a device at the server
   * @param {Device} device - the device to register
   */
  public registerDevice = (device: Device): void => {
    if (this.client) {
      this.client.publish(
        this.getDeviceSpecificTopic(device.tileId, true) + '/active',
        'true',
        this.publishOpts,
      );
      this.client.publish(
        this.getDeviceSpecificTopic(device.tileId, true) + '/name',
        device.name,
        this.publishOpts,
      );
      this.client.subscribe(
        this.getDeviceSpecificTopic(device.tileId, false),
      );
      console.log('Registered device: ' + device.name + ' (' + device.tileId + ')');
    }
  }

  /**
   * Unregister a device at the server
   * @param {Device} device - the device to register
   */
  public unregisterDevice = (device: Device): void => {
    if (this.client) {
      this.client.publish(
        this.getDeviceSpecificTopic(device.tileId, true) + '/active',
        'false',
        this.publishOpts,
      );
      this.client.unsubscribe(
        this.getDeviceSpecificTopic(device.tileId, false),
      );
    }
  }

  /**
   * Send an event to the server
   * @param {string} deviceId - the ID of the device to register
   * @param {CommandObject} event - An event represented as a CommandObject (name, params...)
   */
  public sendEvent = (deviceId: string, event: CommandObject): void => {
    console.log('Sending mqtt event: ' + JSON.stringify(event) + ' To topic: ' + this.getDeviceSpecificTopic(deviceId, true));
    if (this.client) {
      this.client.publish(
        this.getDeviceSpecificTopic(deviceId, true),
        JSON.stringify(event),
        this.publishOpts,
        err => {
          if (err !== undefined) {
            this.errorAlert.present();
          }; // tslint:disable-line
        },
      );
      //this.events.publish('command', JSON.stringify(event));
    }
  }

  /**
   * End the connection to a device
   * @param {string} deviceId - the ID of the device to register
   * @param event - ??
   */
  public endConnection = (deviceId: string, event: any): void => {
    if (this.client) {
      this.client.end();
    }
    this.stopBackgroundFetch();
  }

  /**
   * Run a background update for IOS. This will run every 15 minutes at most and less when
   * the phone thinks it is less likely to be used (at night, etc.). There is nothing to do to
   * make it run more often as this is set by apple. (As of 22.03.2017)
   */
  public startBackgroundFetch = () => {
    this.backgroundFetch.start();
  }

  /**
   * Stop background update for IOS
   */
  public stopBackgroundFetch = () => {
    this.backgroundFetch.stop();
  }
}
