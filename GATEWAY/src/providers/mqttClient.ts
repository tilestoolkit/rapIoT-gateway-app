import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import mqtt from 'mqtt';

import { Device } from './devices.service';
import { TilesApi, CommandObject } from './tilesApi.service';


@Injectable()
export class MqttClient {
  private publishOpts = { retain: true };
  private connectionTimeout: number = 10000; // 10 seconds
  private connectedToBroker: boolean = false;
  private client;
  private mqttConnectionData = {
    username: this.tilesApi.username,
    host: this.tilesApi.hostAddress,//'178.62.99.218',//
    port: this.tilesApi.mqttPort
  };

  constructor(private events: Events,
              private tilesApi: TilesApi) { };

  /**
   * Returns a url for the specific device
	 * @param {string} deviceId - the ID of the device
	 * @param {boolean} isEvent - true if we are sending an event
   */
  getDeviceSpecificTopic = (deviceId: string, isEvent: boolean): string => {
  	const type = isEvent ? 'evt' : 'cmd';
  	return `tiles/${type}/${this.tilesApi.username}/${deviceId}`;
  };

  /**
   * Set the connection status for the server
   * @param {boolean} connected - The new status of the connection
   */
  setMqttConnectionStatus = (connected: boolean): void => {
    this.connectedToBroker = connected;
  };

  /**
   * Create a connection to the server and return a javascript promise
   * @param {string} host - the host url / ip
   * @param {number} port - the port to send to
   */
  connect = (host: string, port: number): void => {
		// Check if a previous server connection exists
		// and end it if it does
		if (this.client) {
			this.client.end();
    }

    // Instantiate a mqtt-client from the host and port
    this.client = mqtt.connect({
      host: host || this.mqttConnectionData.host,//'test.mosquitto.org'
      port: port || this.mqttConnectionData.port, 
      keepalive: 0
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
      this.connectedToBroker = false;
      this.events.publish('offline');
    });

    this.client.on('close', () => {
      this.connectedToBroker = false;
      this.events.publish('close');
    });

    this.client.on('reconnect', () => {
      this.events.publish('reconnect');
    });

    this.client.on('error', error => {
      this.connectedToBroker = false;
      this.events.publish('error', error);
    });

    // Client is connected to the server
		this.client.on('connect', () => {
      console.log(this.client)
			clearTimeout(failedConnectionTimeout);
      this.connectedToBroker = true;
      this.events.publish('serverConnected');
      // NB: temporary for testing only
      this.client.publish(
        'tiles/test', 
        'connect' + (new Date).getTime(),
        this.publishOpts
        );
		});

    // Ends the connection attempt if the timeout rus out
    const failedConnectionTimeout = setTimeout(function(){
      this.client.end();
    }, this.connectionTimeout);
  };

  /**
   * Register a device at the server
   * @param {Device} device - the device to register
   */
	registerDevice = (device: Device): void => {
    if (this.client) {
			this.client.publish(
				this.getDeviceSpecificTopic(device.tileId, true) + '/active',
				'true',
				this.publishOpts
			);
      this.client.publish(
      	this.getDeviceSpecificTopic(device.tileId, true) + '/name',
      	device.name,
      	this.publishOpts
      );
      this.client.subscribe(
      	this.getDeviceSpecificTopic(device.tileId, false)
      );
      console.log('Registered device: ' + device.name + ' (' + device.tileId + ')');
    }
  };

  /**
   * Unregister a device at the server
   * @param {Device} device - the device to register
   */
  unregisterDevice = (device: Device): void => {
    if (this.client) {
      this.client.publish(
      	this.getDeviceSpecificTopic(device.tileId, true) + '/active',
      	'false',
      	this.publishOpts
      );
      this.client.unsubscribe(
      	this.getDeviceSpecificTopic(device.tileId, false)
      );
    }
  };

  /**
   * Send an event to the server
   * @param {string} deviceId - the ID of the device to register
   * @param {CommandObject} event - An event represented as a CommandObject (name, params...)
   */
  sendEvent = (deviceId: string, event: CommandObject): void => {
    if (this.client) {
    	this.client.publish(
    		this.getDeviceSpecificTopic(deviceId, true),
    		JSON.stringify(event),
    		this.publishOpts, err => {
          if (err !== undefined) {
            alert('error sending message: ' + err);
          }
        }
    	);
    }
  };

  /**
   * End the connection to a device
   * @param {string} deviceId - the ID of the device to register
   * @param event - ??
   */
  endConnection = (deviceId: string, event: any): void => {
    if (this.client) {
    	this.client.end()
    }
  };
};
