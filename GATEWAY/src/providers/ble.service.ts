
import { Injectable } from '@angular/core';
import { Events, AlertController } from 'ionic-angular';
import { BLE } from 'ionic-native';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/toPromise';

import { DevicesService }from './devices.service';
import { MqttClient } from './mqttClient';
import { TilesApi  } from './tilesApi.service';
import { CommandObject, Device, UtilsService, VirtualTile } from './utils.service';

// A dictionary of new device names set by user
let tileNames = {};

@Injectable()
export class BleService {
  bleScanner: Subscription;
	rfduino = {
    serviceUUID: '2220',
    receiveCharacteristicUUID: '2221',
    sendCharacteristicUUID: '2222',
    disconnectCharacteristicUUID: '2223',
  };/*
  mockDevices = [
  	{'name': 'TI SensorTag','id': '01:23:45:67:89:AB', 'rssi': -79, 'advertising': null},
  	{'name': 'Some OtherDevice', 'id': 'A1:B2:5C:87:2D:36', 'rssi': -52, 'advertising': null}
  ];*/
  constructor(private events: Events,
              private devicesService: DevicesService,
              private mqttClient: MqttClient,
  						private tilesApi: TilesApi,
              private utils: UtilsService,
              private alertCtrl: AlertController) {
  }

  /**
   * Start the BLE scanner making it scan every 30s
   */
  startBLEScanner = (): void => {
    this.scanForDevices([]);
    this.bleScanner = Observable.interval(30000).subscribe(res => {
      this.scanForDevices([]);
    });
  }

  /**
   * Stop the BLE scanner
   */
  stopBLEScanner = (): void => {
    if (this.bleScanner !== undefined) {
      this.bleScanner.unsubscribe();
    }
  }

  /**
   * Checking if bluetooth is enabled and enable on android if not
   */
  scanForDevices = (virtualTiles: VirtualTile[]): void => {
    this.devicesService.clearDisconnectedDevices();
    BLE.isEnabled()
		  		  .then( res => {
		   		 		this.scanBLE(virtualTiles);
		   		 	})
		  		  .catch( err => {
		  		 		// NB! Android only!! IOS users has to turn bluetooth on manually
		  		 		BLE.enable()
				  		 	 .then( res => {
                   this.scanBLE(virtualTiles);
                  })
				    		 .catch( err => {
                    alert('Failed to enable bluetooth, try doing it manually');
                  });
		  		  });
  };

  /**
   * Checking to see if any bluetooth devices are in reach
   */
  scanBLE = (virtualTiles: VirtualTile[]): void => {
    // A list of the discovered devices
    let newDevices: Array<Device> = [];

    //TODO: BUG: The completion function is never called.
    //TODO: unsubscribe at some point

    // Subscribing to the observable returned by BLE.scan()
    BLE.scan([], 30).subscribe(
      // function to be called for each new device discovered
      bleDevice => {
        if (this.tilesApi.isTilesDevice(bleDevice) && this.devicesService.isNewDevice(bleDevice)) {
          this.devicesService.convertBleDeviceToDevice(bleDevice).then( device => {
            //test that the discovered device is not in the list of new devices
            if (!newDevices.map(discoveredDevice => discoveredDevice.id).includes(device.id)) {
              this.mqttClient.registerDevice(device);
              this.devicesService.newDevice(device);
              newDevices.push(device);
              if (virtualTiles.map(tile => tile.tile.name).includes(device.tileId)) {
                this.connect(device);
              }
              //TODO: temporary, until we get the completion function to run
              this.events.publish('updateDevices');
            }
          }).catch(err => alert(err));
        }
      },
      err => {
        alert('Error when scanning for devices: ' + err);
      },
      () => {
        alert('No more devices');
        // If we found any devices we should update the device list
        if (newDevices.length > 0) {
          this.events.publish('updateDevices');
        }
        console.log('\nNo more devices: ');
      });
  };

  /**
   * Connect to a device
	 * @param {Device} device - the target device
	 */
  connect = (device: Device): void => {
    device.loading = true;
    //TODO: unsubscribe at some point ?
  	BLE.connect(device.id)
  		  .subscribe(
          res => {
    		  	// Setting information about the device
  	  		 	device.ledOn = false;
            device.connected = true;
            device.buttonPressed = false;
  	        //this.tilesApi.loadEventMappings(device.tileId);
            this.mqttClient.registerDevice(device);
            this.startDeviceNotification(device);
            if (device.name in tileNames){
              device.name = tileNames[device.name];
            }
            device.loading = false;
          },
          err => {
            device.connected = false;
            device.loading = false;
            this.devicesService.clearDisconnectedDevices();
            this.events.publish('updateDevices');
            this.disconnect(device);
            //alert('Lost connection to ' + device.name)
          },
          () => {
            alert('Connection attempt completed')
          });
  };

  /**
   * Connect and rename a device
   * @param {Device} device - the target device
   */
  locate = (device: Device): void => {
    device.loading = true;
    //TODO: unsubscribe at some point ?
    BLE.connect(device.id)
        .subscribe(
          res => {
            // Setting information about the device
            device.ledOn = false;
            device.connected = true;
            device.buttonPressed = false;
            //this.tilesApi.loadEventMappings(device.tileId);
            this.mqttClient.registerDevice(device);
            this.startDeviceNotification(device);
            if (device.name in tileNames){
              device.name = tileNames[device.name];
            }

            this.sendData(device, 'led,on,red');
            setTimeout(()=> {this.sendData(device, 'led,off'); this.disconnect(device);}, 3000);
            device.loading = false;
          },
          err => {
            device.connected = false;
            device.loading = false;
            this.devicesService.clearDisconnectedDevices();
            this.events.publish('updateDevices');
            this.disconnect(device);
            //alert('Lost connection to ' + device.name)
          },
          () => {
            alert('Connection attempt completed')
          });
  };

  /**
   * Start getting notifications of events from a device
   * @param {Device} device - the id from the target device
   */
  startDeviceNotification = (device: Device): void => {
    //alert('Starting notifications from device: ' + device.name);
    //TODO: unsubscribe at some point. Could return the subscriber and unsubscribe after a timeout
    BLE.startNotification(device.id, this.rfduino.serviceUUID, this.rfduino.receiveCharacteristicUUID)
      .subscribe(
        res => {
          // Convert the bytes sent from the device into a string
          const responseString = ((String.fromCharCode.apply(null, new Uint8Array(res))).slice(0, -1)).trim();
          let message: CommandObject = this.utils.getEventStringAsObject(responseString);
          //alert('Recieved event: ' + message.name + ' with properties: ' + message.properties);
          if (message === null) {
            alert('Found no mapping for event: ' + responseString);
          } else {
            // Switch on the event type of the message
            // for testing purposes only
            const eventType = message.properties[0];
            switch (eventType){
              case 'tap':
                device.buttonPressed = device.buttonPressed !== undefined
                                      ? !device.buttonPressed : true;
                //alert('tappeti tap')
                break;
              case 'tilt':
                //alert('You are tilting me!');
                break;
              default:
                alert('No response for ' + message.properties[0])
                break;
            }
            this.mqttClient.sendEvent(device.tileId, message);
            this.events.publish('recievedEvent', device.tileId, message);
          }
        },
        err => {
          console.log('Failed to start notification');
        },
        () => {
          // called when the device disconnects
          device.connected = false;
        });
  };

  /**
   * Disconnect from device
	 * @param {Device} device - the target device
	 */
  disconnect = (device: Device): void => {
  	BLE.disconnect(device.id)
  					.then( res => {
  						device.connected = false;
  						this.mqttClient.unregisterDevice(device);
  					})
  					.catch( err => {
              console.log('Failed to disconnect');
            });
  };

  /**
   * Send data to a device using BLE
   * @param {Device} device - the target device
   * @param {string} dataString - the string of data to send to the device
   */
  sendData = (device: Device, dataString: string): void => {
    try {
      console.log('Attempting to send data to device via BLE.');
      const dataArray = this.utils.convertStringtoBytes(dataString);
      // Attempting to send the array of bytes to the device
      BLE.writeWithoutResponse(device.id,
                               this.rfduino.serviceUUID,
                               this.rfduino.sendCharacteristicUUID,
                               dataArray.buffer)
              //.then( res => alert('Success sending the string: ' + dataString))
              .catch( err => alert('Failed when trying to send data to the device!'));
    } catch (err) {
      alert('Failed when trying to send data to the device!');
    }
  };
}
