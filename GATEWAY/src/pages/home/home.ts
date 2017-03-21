import { Component } from '@angular/core';
import { AlertController, Events, NavController, Platform } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import { Http } from '@angular/http';
import { BleService } from '../../providers/ble.service';
import { DevicesService } from '../../providers/devices.service';
import { MqttClient } from '../../providers/mqttClient';
import { TilesApi } from '../../providers/tilesApi.service';
import { Application, CommandObject, Device, UtilsService, VirtualTile } from '../../providers/utils.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [
    TilesApi,
    MqttClient,
    DevicesService,
    BleService,
  ],
})
export class HomePage {
  devices: Device[];
  serverConnectStatusMsg: string;
  statusMsg: string;
  bleScanner: Subscription;
  virtualTiles: VirtualTile[];
  applications: Application[];
  activeApp: Application;

  constructor(public alertCtrl: AlertController,
              public navCtrl: NavController,
              public platform: Platform,
              private events: Events,
              private http: Http,
              private bleService: BleService,
              private devicesService: DevicesService,
              private mqttClient: MqttClient,
              private tilesApi: TilesApi,
              private utils: UtilsService) {
  	this.setDevices();
    this.setVirtualTiles();
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
      this.mqttClient.setMqttConnectionStatus(false);
      this.serverConnectStatusMsg = 'Client gone offline';
      if (this.bleScanner !== undefined) {
        this.bleScanner.unsubscribe();
      }
    });

    this.events.subscribe('close', () => {
      this.mqttClient.setMqttConnectionStatus(false);
      this.serverConnectStatusMsg = 'Disconnected from server';
    });

    this.events.subscribe('reconnect', () => {
      this.mqttClient.setMqttConnectionStatus(false);
      this.serverConnectStatusMsg = 'A reconnect is started';
    });

    this.events.subscribe('error', (err) => {
      this.mqttClient.setMqttConnectionStatus(false);
      this.serverConnectStatusMsg = 'Error: ${err}';
    });

	  this.events.subscribe('command', (deviceId: string, command: CommandObject) => {
	    for (let device of this.devices) {
	      if (device.tileId === deviceId) {
	      	//alert('Recieved command from server: ' + JSON.stringify(command));
	        device.ledOn = (command.name === 'led' && command.properties[0] === 'on');
	        console.log('Device led on: ' + device.ledOn);
	        const commandString = this.utils.getCommandObjectAsString(command);
	        this.bleService.sendData(device, commandString);

        }
      }
    });

    this.events.subscribe('updateDevices', () => {
      this.setDevices();
    });
  }

  /**
   * Set the devices equal to the devices from devicesservice
   */
  setDevices = (): void => {
    this.devices = this.devicesService.getDevices();
  }

  /**
   * Set the virtual tiles equal to the ones stores for the app
   */
  setVirtualTiles = (): void => {
    //TODO: Use the appname for the chosen app when implemented
    if (this.activeApp !== undefined){
      this.tilesApi.getApplicationTiles(this.activeApp._id).then(res => {
        this.virtualTiles = res; 
        console.log(res)
      });
    }
    else {
      this.tilesApi.getApplicationTiles('test3').then(res => {
        this.virtualTiles = res; 
      });

    }
  }

  /**
   * Set the list of applications from the api
   */
  setApplications = (): void => {
    this.tilesApi.getAllApplications().then( data => {
      this.applications = data;
      console.log(data)
      console.log(this.applications)
    }).catch (err => console.log(err));
  }

  /**
   * Set the active application
   * @param {Application} application - a tiles application
   */
  setActiveApp = (application: Application): void => {
    this.activeApp = application;
    console.log(this.activeApp._id)
    this.setVirtualTiles();
  } 

  /**
   * Use ble to discover new devices
   */
  scanForNewBLEDevices = (): void => {
    this.statusMsg = 'Searching for devices...';
    this.devicesService.clearDisconnectedDevices();
    this.bleService.scanForDevices(this.virtualTiles);
    this.setDevices();
  }

  /**
   * Connect to the mqttServer
   * @param {string} user - username
   * @param {string} host - api host address
   * @param {number} port - mqtt port number
	 */
	connectToServer = (user: string, host: string, port: number): void => {
		if (this.utils.verifyLoginCredentials(user, host, port)) {
			this.mqttClient.connect(user, host, port);
		} else {
			alert("Invalid login credentials.");
		}
	}

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
	}


  /**
   * Triggers an event on a tile to identify which tile is which
   * @param {Device} device - A tile
   */
  identifyDevice = (device: Device): void => {
    this.bleService.sendData(device, 'led,on,red');
    setTimeout(()=> (this.bleService.sendData(device, 'led,off')), 3000);
  }

  /**
   * Show the popup to connect to broker
   */
	showConnectMQTTPopup = () => {
		let alertPopup = this.alertCtrl.create({
			title: 'Connect to server',
			inputs: [
				{
					name: 'username',
					placeholder: 'Username',
				},
				{
					name: 'host',
					placeholder: 'Host',
				},
				{
					name: 'port',
					placeholder: 'MQTT-Port',
					type: 'number',
				},
			],
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: data => {
						console.log('Cancel clicked');
					},
				},
				{
					text: 'Connect',
					handler: data => {
						this.connectToServer(data.username, data.host, parseInt(data.port));
            this.setApplications();
					},
				},
			],
		});
		alertPopup.present();
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
          placeholder: 'new name',
      }],
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Rename',
          handler: data => {
            this.devicesService.setCustomDeviceName(device, data.newName);
          },
      }],
    }).present();
  }

  /**
   * Called when the pair button is pushed on the view of the the
   * the virtual tiles.
   * @param {VirtualTile} virtualTile - the target device
   */
  pairTilePopUp = (virtualTile: VirtualTile): void => {
    const deviceRadioButtons = this.devices.map(device => {
      return {type: 'radio', name: 'deviceId', value: device.tileId, label: device.name}
    });
    this.alertCtrl.create({
      title: 'Pair to physical tile',
      inputs: deviceRadioButtons,
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Pair',
          handler: data => {
            this.tilesApi.pairDeviceToVirualTile(data, virtualTile._id, 'test3');
          },
      }],
    }).present();
  }
}
