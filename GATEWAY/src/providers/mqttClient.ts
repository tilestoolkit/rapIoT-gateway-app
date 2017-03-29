import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import mqtt from 'mqtt';

import { CommandObject, Device, LoginData } from './utils.service';
import { TilesApi } from './tilesApi.service';


@Injectable()
export class MqttClient {
  private publishOpts = { retain: true };
  private connectionTimeout: number = 10000; // 10 seconds
  private client;
  private mqttConnectionData: LoginData;

  constructor(private events: Events,
              private tilesApi: TilesApi) {
    this.mqttConnectionData = this.tilesApi.getLoginData();
  }

  setConnectionData = (mqttConnectionData: LoginData = null): void => {
    if(mqttConnectionData === null){
      this.mqttConnectionData = this.tilesApi.getLoginData();
    } else {
      this.mqttConnectionData = mqttConnectionData;
    }
  };

  /**
   * Returns a url for the specific device
   * @param {string} deviceId - the ID of the device
   * @param {boolean} isEvent - true if we are sending an event
   */
  getDeviceSpecificTopic = (deviceId: string, isEvent: boolean): string => {
    const type = isEvent ? 'evt' : 'cmd';
    return `tiles/${type}/${this.mqttConnectionData.user}/${deviceId}`;
  }

  /**
   * Create a connection to the server and return a javascript promise
   * @param {string} user - the user name
   * @param {string} host - the host url / ip
   * @param {number} port - the port to send to
   */
  connect = (): void => {
    if (this.mqttConnectionData === undefined ||  this.mqttConnectionData === null) {
      this.mqttConnectionData = this.tilesApi.getLoginData();
    }

    // Check if a previous server connection exists and end it if it does
    if (this.client) {
      this.client.end();
    }

    // Instantiate a mqtt-client from the host and port
    this.client = mqtt.connect({
      host: this.mqttConnectionData.host, // 'test.mosquitto.org'
      port: this.mqttConnectionData.port,
      keepalive: 0,
    });

    // Handle events from the broker
    this.client.on('message', (topic, message) => {
      try {
        const command: CommandObject = JSON.parse(message);
        if (command) {
          const deviceId = topic.split('/')[3];
          this.events.publish('command', deviceId, command);
        }
      } finally {}
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
    });

    this.client.on('connect', () => {
      console.log('connected to broker');
      clearTimeout(failedConnectionTimeout);
      this.events.publish('serverConnected');
    });

    // Ends the connection attempt if the timeout rus out
    const failedConnectionTimeout = setTimeout(function(){
      if (this.client) {
        this.client.end();
      }
    }, this.connectionTimeout);
  }

  /**
   * Register a device at the server
   * @param {Device} device - the device to register
   */
  registerDevice = (device: Device): void => {
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
  unregisterDevice = (device: Device): void => {
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
  sendEvent = (deviceId: string, event: CommandObject): void => {
    console.log('Sending mqtt event: ' + JSON.stringify(event) + ' To topic: ' + this.getDeviceSpecificTopic(deviceId, true));
    if (this.client) {
      this.client.publish(
        this.getDeviceSpecificTopic(deviceId, true),
        JSON.stringify(event),
        this.publishOpts, err => {
          if (err !== undefined) {
            alert('error sending message: ' + err);
          }
        },
      );
    }
  }

  /**
   * End the connection to a device
   * @param {string} deviceId - the ID of the device to register
   * @param event - ??
   */
  endConnection = (deviceId: string, event: any): void => {
    if (this.client) {
      this.client.end();
    }
  }
}
