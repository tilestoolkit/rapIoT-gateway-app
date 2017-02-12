import { Component } from '@angular/core';
import { Events, Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { BleService } from '../../providers/ble.service';
import { Device, DevicesService } from '../../providers/devices.service';
import { MqttClient } from '../../providers/mqttClient';
import { TilesApi } from '../../providers/tilesApi.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [
  	TilesApi,
  	MqttClient,
  	DevicesService,
  	BleService
  ]
})

export class HomePage {
	public devices: Device[];
	serverConnectStatusMsg: string;
	statusMsg: string;

  constructor(public navCtrl: NavController,
  						public events: Events,
  						public platform: Platform,
  						private bleService: BleService,
  						private devicesService: DevicesService,
  						public tilesApi: TilesApi,
  						private mqttClient: MqttClient)
  {
  	this.devices = devicesService.getDevices();
  	this.serverConnectStatusMsg = 'Click to connect to server';
  	//TODO: Dunno if this should be in the constructor or if that was a mistake
	  this.events.subscribe('command', (deviceId, command) => {
	    for (let i = 0; i < this.devices.length; i++) {
	      const device = this.devices[i];
	      if (device.id === deviceId) {
	        device.ledOn = (command.name === 'led' && command.properties[0] === 'on');
	        console.log('Device led on: '+device.ledOn);
	        const commandString = this.tilesApi.getCommandObjectAsString(command);
	        this.bleService.sendData(device, commandString);
        }
      }
    });

	  this.events.subscribe('updateDevices', () => {
	  	this.statusMsg = 'Found new devices';
	  	this.devices = devicesService.getDevices();
	  	for (let device of this.devices) {
	  		this.mqttClient.registerDevice(device);
	  	}
	  });

	  this.events.subscribe('serverConnected', () => {
	  	this.serverConnectStatusMsg = 'Connected to server';
	  	this.statusMsg = 'Searching for devices...';
	  	this.bleService.scanForDevices();
	  });

	  this.events.subscribe('offline', () => {
	  	this.mqttClient.setServerConnectionStatus(false);
	  	this.serverConnectStatusMsg = 'Client gone offline';
	  });

	  this.events.subscribe('close', () => {
	  	this.mqttClient.setServerConnectionStatus(false);
	  	this.serverConnectStatusMsg = 'Disconnected from server';
	  });

		this.events.subscribe('reconnect', () => {
	  	this.mqttClient.setServerConnectionStatus(false);
	  	this.serverConnectStatusMsg = 'A reconnect is started';
	  });

		this.events.subscribe('error', (err) => {
	  	this.mqttClient.setServerConnectionStatus(false);
	  	this.serverConnectStatusMsg = 'Error: ${err}';
	  });

	};

	connectToServer = () => {
		this.mqttClient.connect(this.tilesApi.hostAddress, this.tilesApi.mqttPort);
	};

	refreshDevices = (refresher) => {
		console.log('Scanning for more devices...');
		this.bleService.scanForDevices()/*
									 .then(res => {
									 		this.statusMsg = res;
									 		refresher.complete();
									 	}).catch(err => {
									 		this.statusMsg = err;
									 		refresher.complete();
									 	});*/
	}
}
