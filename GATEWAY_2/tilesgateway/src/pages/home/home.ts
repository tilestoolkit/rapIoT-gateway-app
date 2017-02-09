import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
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

  constructor(public navCtrl: NavController,
  						public events: Events,
  						private bleService: BleService,
  						private devicesService: DevicesService,
  						public tilesApi: TilesApi,
  						private mqttClient: MqttClient)
  {
  	this.devices = devicesService.getMockDevices();
  	this.serverConnectStatusMsg = 'Click to connect to server';

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
	  	this.devices = devicesService.getDevices();
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

	connect = () => {
		this.mqttClient.connect(this.tilesApi.hostAddress, this.tilesApi.mqttPort);

		this.serverConnectStatusMsg = 'COnnected to server';
	}


}
