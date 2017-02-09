import { Injectable } from '@angular/core';
import { BLE } from 'ionic-native';
import 'rxjs/add/operator/toPromise';
import { MqttClient } from './mqttClient';
import { TilesApi } from './tilesApi.service';
import { DevicesService, Device }from './devices.service';

@Injectable()
export class BleService {

	rfduino = {
    serviceUUID: '2220',
    receiveCharacteristicUUID: '2221',
    sendCharacteristicUUID: '2222',
    disconnectCharacteristicUUID: '2223'
  };

  mockDevices = [
  	{'name': 'TI SensorTag','id': '01:23:45:67:89:AB', 'rssi': -79, 'advertising': null},
  	{'name': 'Some OtherDevice', 'id': 'A1:B2:5C:87:2D:36', 'rssi': -52, 'advertising': null}
  ];

  constructor(private mqttClient: MqttClient,
  						private tilesApi: TilesApi,
              private devicesService: DevicesService) {
  };

  /* Send data to a device using BLE
	 * @param device: the target device
	 * @param dataString: the string of data to send to the device
	*/
  sendData = (device: any, dataString: string) => {
  	try {
  	  	console.log('Attempting to send data to device via BLE.');

  	  	// TODO: See if we can find a better way to do this
  	  	// Turns the dataString into an array of bytes
  	  	let dataArray = new Uint8Array(dataString.length);
  	  	for(let i = 0, l = dataString.length; i < l; i ++){
  	  		dataArray[i] = dataString.charCodeAt(i);
        }
      console.log('Bytes: ' + dataArray.length);

  	  	// Attempting to send the array of bytes to the device
  	  	BLE.writeWithoutResponse(device.id,
  	  													 this.rfduino.serviceUUID,
  	  													 this.rfduino.sendCharacteristicUUID,
  	  													 dataArray.buffer)
  			  		  .then( res => console.log('Success sending the string: ' + dataString))
  			  		  .catch( err => alert('Failed when trying to send daata to the RFduino'));
    } finally {
    }
  };

  // Checking if bluetooth is enabled and enable on android if not
  doRefresh = () => {
  	BLE.isEnabled()
		  		  .then( res => {
		   		 		console.log('Bluetooth is enabled');
		   		 		this.scanForDevices();
		   		 	})
		  		  .catch( err => {
		  		 		console.log('Bluetooth not enabled!');
		  		 		// NB! Android only!! IOS users has to be told to turn bluetooth on
		  		 		BLE.enable()
				  		 			  .then( res => console.log('Bluetooth has been enabled'))
				  		 			  .catch( err => console.log('Failed to enable bluetooth'));
		  		  });
  };

  // Checking to see if any bluetooth devices are in reach
  scanForDevices = () => {
		// The first param is the UUIDs to discover, this might
 		// be specified to only search for tiles.
 		BLE.scan([], 5).toPromise()
 			 	// TODO: match the app.onDiscoverDevice from controllers.js in old code
 			 	// but in a better way
		 				.then( res => {
		 			 		const device = res;
		 			 		console.log('Device discovered: ' + device);
		 			 		if(this.isTilesDevice(device) && this.isNewDevice(device)) {
		 			 			this.mqttClient.registerDevice(device);
                this.devicesService.newDevice(device);
		 			 		}
		 			 	})
		 			  .catch( err => console.log('Error when scanning for devices'));
  };

  isTilesDevice = (device: any) => (device.name != null && device.name.substring(0, 4) === 'Tile');

  isNewDevice = (device: any) => {
  	//TODO: use actual devices!
  	for (let i = 0; i < this.mockDevices.length; i ++) {
  		if (this.mockDevices[i].id === device.id) {
  			return false;
  		}
  	}
  	return true;
  };

  /* Update the name of a device
	 * @param device: the target device
	 * @param newName: The new name
	*/
  updateName = (device: any, newName: string) => {
  	BLE.disconnect(device.id)
			  		.then( res => {
			  		 	device.connected = false;
			  		 	this.mqttClient.unregisterDevice(device);
			  		 	device.name = newName;
			  		 	this.connect(device);
			  		})
			  		.catch(err => alert('Failed to update the name of device: ' + device.name));
  };

  /* Connect to a device
	 * @param device: the target device
	*/
  connect = (device: any) => {
  	BLE.connect(device.id).toPromise()
  		  .then( res => {
  		  	// Setting information about the device
	  		 	device.ledOn = false;
	  		 	device.connected = true;
	        this.tilesApi.loadEventMappings(device.id);
	        BLE.startNotification(device.id, this.rfduino.serviceUUID, this.rfduino.receiveCharacteristicUUID)
	        				.toPromise()
	        				.then( res => {
	        					// Convert the bytes sent from the device into a string
	        					const responseString = String.fromCharCode.apply(null, new Uint8Array(res));
	        					console.log('Recieved event: ' + responseString);
	        					let message = this.tilesApi.getEventStringAsObject(responseString);
	        					if (message === null) {
	        						console.log('Found no mapping for event: ' + responseString);
	        					} else {
	        						message.name = device.name;
	        						if (message.properties[0] === 'touch') {
	        							device.buttonPressed = !device.buttonPressed
	        						}
	        						console.log('Sending message: ' + JSON.stringify(message));
	        						this.mqttClient.sendEvent(device.id, message);
	        					}
	        				})
	        				.catch( err => alert('Failed to start notification'));
					this.mqttClient.registerDevice(device);
	  		})
	  		.catch( err => alert('Failed to connect to device ' + device.name));
  };

  /* Desconnect from device
	 * @param device: the target device
	*/
  disconnect = (device: any) => {
  	BLE.disconnect(device.id)
  					.then( res => {
  						device.connected = false;
  						this.mqttClient.unregisterDevice(device);
  					})
  					.catch( err => alert('Failed to disconnect'))
  };
}
