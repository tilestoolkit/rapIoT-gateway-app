import { Component } from '@angular/core';
import { AlertController, Events, NavController, Platform } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';

import { BleService } from '../../providers/ble.service';
import { Device, DevicesService } from '../../providers/devices.service';
import { MqttClient } from '../../providers/mqttClient';
import { TilesApi, CommandObject, VirtualTile } from '../../providers/tilesApi.service';

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
  devices: Device[];
  serverConnectStatusMsg: string;
  statusMsg: string;
  bleScanner: Subscription;
  virtualTiles: VirtualTile[];

  constructor(public alertCtrl: AlertController,
              public navCtrl: NavController,
              public platform: Platform,
              private events: Events,
              private bleService: BleService,
              private devicesService: DevicesService,
              private tilesApi: TilesApi,
              private mqttClient: MqttClient) {
  	this.setDevices();
  	this.serverConnectStatusMsg = 'Click to connect to server';

  	// Subscriptions to events that can be emitted from other places in the code
    this.events.subscribe('serverConnected', () => {
      this.serverConnectStatusMsg = 'Connected to server';
      // Scans for new devices once, and then every 30 seconds
      this.scanForNewBLEDevices();
      this.bleScanner = Observable.interval(30000).subscribe(res => {
        this.scanForNewBLEDevices();
      });
    });

    this.events.subscribe('offline', () => {
      this.mqttClient.setServerConnectionStatus(false);
      this.serverConnectStatusMsg = 'Client gone offline';
      if (this.bleScanner !== undefined) {
        this.bleScanner.unsubscribe();
      }
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

	  this.events.subscribe('command', (deviceId: string, command: CommandObject) => {
	    for (let device of this.devices) {
	      if (device.tileId === deviceId) {
	      	//alert('Recieved command from server: ' + JSON.stringify(command));
	        device.ledOn = (command.name === 'led' && command.properties[0] === 'on');
	        console.log('Device led on: ' + device.ledOn);
	        const commandString = this.tilesApi.getCommandObjectAsString(command);
	        this.bleService.sendData(device, commandString);

        }
      }
    });

    this.events.subscribe('updateDevices', () => {
      this.setDevices();
    });
  };

  /**
   * Set the devices equal to the devices from devicesservice
   */
  setDevices = (): void => {
    this.devices = this.devicesService.getDevices();
  }

  /**
   * Use ble to discover new devices
   */
  scanForNewBLEDevices = (): void => {
    this.statusMsg = 'Searching for devices...';
    this.devicesService.clearDisconnectedDevices();
    this.bleService.scanForDevices();
    this.setDevices();
  };

  /**
   * Connect to the mqttServer
   */
  connectToServer = (): void => {
    this.mqttClient.connect(this.tilesApi.hostAddress, this.tilesApi.mqttPort);
  };

	fetchEventMappings = (device: Device): void => {
		this.tilesApi.fetchEventMappings(device.tileId);
	};

  /**
   * Called when the refresher is triggered by pulling down on the view of 
	 * the devices. TODO: Not sure if needed when refresh is done every 30s anyways.
	 */
	refreshDevices = (refresher): void => {
		console.log('Scanning for more devices...');
		this.scanForNewBLEDevices();
		//Makes the refresher run for 2 secs
		setTimeout(() => {
			refresher.complete();
		}, 2000);
	};


  /**
   * Called when the rename button is pushed on the view of the the
   * the devices.
   * @param {Device} device - the target device
   */
  changeNamePop = (device: Device): void => {
    this.alertCtrl.create({
      title: 'Change tile name',
      inputs: [{
          name: 'newName',
          placeholder: 'new name'
      }],
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Rename',
          handler: data => {
            this.devicesService.setCustomDeviceName(device, data.newName);
          }
      }]
    }).present();
  };
};
