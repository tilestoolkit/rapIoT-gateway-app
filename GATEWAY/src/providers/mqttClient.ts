import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import mqtt from 'mqtt';

import { Device } from './devices.service';
import { TilesApi, CommandObject } from './tilesApi.service';


@Injectable()
export class MqttClient {
  publishOpts = { retain: true };
  serverConnectionTimeout: number = 10000; // 10 seconds
  connectedToServer: boolean = false;
  client;
  mqttConnectionData = {
    username: this.tilesApi.username,
    host: this.tilesApi.hostAddress,//'178.62.99.218',//
    port: this.tilesApi.mqttPort
  };

  constructor(public events: Events,
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
  setServerConnectionStatus = (connected: boolean): void => {
    this.connectedToServer = connected;
  };

  /**
   * Create a connection to the server and return a javascript promise
   * @param {string} host - the host url / ip
   * @param {number} port - the port to send to
   */
  connect = (host: string, port: number): void => {
    let client = this.client;
		// Check if a previous server connection exists
		// and end it if it does
		if (client) {
			client.end();
    }

    // Instantiate a mqtt-client from the host and port
    client = mqtt.connect({
      host: 'test.mosquitto.org', //host || this.mqttConnectionData.host,
      port: port || this.mqttConnectionData.port, 
      keepalive: 0
		});
    
    // Handle a message from the broker
    client.on('message', (topic, message) => {
      try {
        const command: CommandObject = JSON.parse(message);
        if (command) {
          const deviceId = topic.split('/')[3];
          this.events.publish('command', deviceId, command);
        }
      } finally {}
    });

    client.on('offline', () => {
      this.connectedToServer = false;
      this.events.publish('offline');
    });

    client.on('close', () => {
      this.connectedToServer = false;
      this.events.publish('close');
    });

    client.on('reconnect', () => {
      this.events.publish('reconnect');
    });

    client.on('error', error => {
      this.connectedToServer = false;
      this.events.publish('error', error);
    });

    // Client is connected to the server
		client.on('connect', () => {
      console.log(client)
			clearTimeout(failedConnectionTimeout);
      this.connectedToServer = true;
      this.events.publish('serverConnected');
      // NB: temporary testing only
      client.publish(
        'tiles/test', 
        'testing',
        this.publishOpts
        );
		});

    // Ends the attempt tp connect if the timeout rus out
    const failedConnectionTimeout = setTimeout(function(){
      client.end();
    }, this.serverConnectionTimeout);
  };

  /**
   * Register a device at the server
   * @param {Device} device - the device to register
   */
	registerDevice = (device: Device): void => {
    alert(device.name)
    const client = this.client;
		if (client) {
			client.publish(
				this.getDeviceSpecificTopic(device.tileId, true) + '/active',
				'true',
				this.publishOpts
			);
      client.publish(
      	this.getDeviceSpecificTopic(device.tileId, true) + '/name',
      	device.name,
      	this.publishOpts
      );
      client.subscribe(
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
    const client = this.client;
    if (client) {
      client.publish(
      	this.getDeviceSpecificTopic(device.tileId, true) + '/active',
      	'false',
      	this.publishOpts
      );
      client.unsubscribe(
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
          alert('error sending message: ' + err)
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
