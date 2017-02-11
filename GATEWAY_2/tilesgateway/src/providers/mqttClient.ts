import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import mqtt from 'mqtt';

import { TilesApi } from './tilesApi.service';
import { Device } from './devices.service';
/*
interface MqttClientInterface {

	connect: (host: string, port: string) => Observable((observer: any) => void);
	registerDevice: (device: any) => void;
	unregisterDevice: (device: any) => void;
	sendEvent: (deviceId: string, event: any) => void;
	endConnection: (deviceId: string, event: any) => void;
}*/

@Injectable()
export class MqttClient {
  publishOpts = { retain: true };
  serverConnectionTimeout: number = 10000; // 10 seconds  
  connectedToServer: boolean = false; 
  client;


  constructor(public events: Events,
              private tilesApi: TilesApi) { };


  mqttConnectionData = {
    username: this.tilesApi.username,
    host: this.tilesApi.hostAddress,
    port: this.tilesApi.mqttPort
  };

  /* Returns a url for the specific device
	 * @param deviceId: String
	 * @param isEvent: Boolean
   */
  getDeviceSpecificTopic = (deviceId: string, isEvent: boolean): string => {
  	const type = isEvent ? 'evt' : 'cmd';
  	return 'tiles/' + type + '/' + this.tilesApi.username + '/' + deviceId;
  };

  setServerConnectionStatus = (connected: boolean) => {
    this.connectedToServer = connected;
  };

  /* Create a connection to the server and
   * return a javascript promise 
   */
  connect = (host: string, port: number) => {

		// Check if a previous server connection exists
		// and end it if it does
		if (this.client) {
			this.client.end();
		};

		
		// Instantiate a mqtt-client from the host and port
		// keepalive 0 disables keepalive
		this.client = mqtt.connect({
			host: host, 
			port: port,
			keepalive: 0 
		});


		// Handlers for different types of responses from the server: 

		// Client is connected to the server
		this.client.on('connect', () => {
			clearTimeout(this.serverConnectionTimeout);
			alert('Connected');
		});

		// Handle a message from the server
		this.client.on('message', (topic, message) => {
			console.log('Received message from server: ' + message);
			try {
				const command = JSON.parse(message);
				if (command) {
					const deviceId = topic.split('/')[3];
          this.events.publish('command', deviceId, command);
			  };
      } finally { alert(message) };
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
  };


  // The functions called on the client comes from the mqtt-library,
  // API reference can be found at https://github.com/mqttjs/MQTT.js
	registerDevice = (device: Device) => {
		if (this.client) {

			this.client.publish(
				this.getDeviceSpecificTopic(device.id, true) + '/active', 
				'true', 
				this.publishOpts
			);

      this.client.publish(
      	this.getDeviceSpecificTopic(device.id, true) + '/name', 
      	device.name, 
      	this.publishOpts
      );

      this.client.subscribe(
      	this.getDeviceSpecificTopic(device.id, false)
      );

      this.events.publish('updateDevices');
      console.log('Registered device: ' + device.name + ' (' + device.id + ')');
  	};
	};

  unregisterDevice = (device: Device) => {
    if (this.client) {

      this.client.publish(
      	this.getDeviceSpecificTopic(device.id, true) + '/active', 
      	'false', 
      	this.publishOpts
      );

      this.client.unsubscribe(
      	this.getDeviceSpecificTopic(device.id, false)
      );
    };
  };

  sendEvent = (deviceId, event) => {
    if (this.client) {

    	this.client.publish(
    		this.getDeviceSpecificTopic(deviceId, true), 
    		JSON.stringify(event), 
    		this.publishOpts
    	);
    };
  };

  endConnection = (deviceId, event) => {
    if (this.client) {
    	this.client.end()
    };
  };

}