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

  	// Subscriptions to events that can be emitted from other places in the code
  	//TODO: Dunno if these should be in the constructor or if that was a mistake
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
	  	this.statusMsg = this.devices.toString();
	  });

	  this.events.subscribe('serverConnected', () => {
	  	this.serverConnectStatusMsg = 'Connected to server';
	  	this.scanForNewBLEDevices();
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

  /**
   * Use ble to discover new devices
	 */
	scanForNewBLEDevices = () => {
		this.statusMsg = 'Searching for devices...';

		// A list of the discovered devices
		let newDevices: Array<Device> = [];    
    
    //TODO: BUG: The completion function is never called. 

		// The ble-service returns an observable and we subscribe to it here
		// This means that for every new device discovered the first function 
		// should run, and when it has discovered all the devices it should run 
		// the last one. 
		this.bleService.scanForDevices().subscribe(
			// function to be called for each new device discovered
	    bleDevice => {
	      let device = this.devicesService.convertBleDeviceToDevice(bleDevice);
	      //debugging
	      this.statusMsg = 'Found device: ' + JSON.stringify(device);
	      //test that we don't add the same device twice
	      if (!newDevices.map(function(a) {return a.id}).includes(device.id) && !this.devices.map(function(a) {return a.id}).includes(device.id)){
	        this.mqttClient.registerDevice(device);
	        this.devicesService.newDevice(device);
	        newDevices.push(device);
	        //TODO: temporary, until we get the completion function to run
      		this.events.publish('updateDevices');
	      }
	    },
	    // function to be called if an error occurs
	    err => {
	      alert('Error when scanning for devices: ' + err);
	    },
	    // function to be called when the scan is complete
	    () => {
	      alert('No more devices');
	      // If we found any devices we should update the device list
	      if (newDevices.length > 0) {
	        this.events.publish('updateDevices');
	      }
	      console.log('\nNo more devices: ');
	  });
	  this.statusMsg = 'Done scanning';
	}

  /**
   * Connect to the mqttServer
	 */
	connectToServer = () => {
		this.mqttClient.connect(this.tilesApi.hostAddress, this.tilesApi.mqttPort);
	};

  /**
   * Called when the refresher is triggered by pulling down on the view of 
	 * the devices. 
	 */
	refreshDevices = (refresher) => {
		console.log('Scanning for more devices...');
		this.scanForNewBLEDevices();
	}
}
