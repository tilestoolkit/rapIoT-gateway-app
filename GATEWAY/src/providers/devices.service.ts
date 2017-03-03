import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';


/**
 * Class for the devices, this makes it possible to specify the
 * device type in typescript to avoid getting invalid device-objects
 */
export class Device {
  id: string;
  tileId: string; // IOS and android gets different id from the ble, so we use the tilename as a seond id
  name: string;
  connected: boolean;
  ledOn: boolean;
  buttonPressed?: boolean;
}

@Injectable()
export class DevicesService {
	devices: Device[];

  constructor(public storage: Storage,
              public events: Events) {
    this.devices = [];
  };

  /**
   * Returns mock devices for testing purposes
   */
  getMockDevices = (): Device[] => ([
  	{id: '01:23:45:67:89:AB', tileId: 'Tile1', name: 'TI SensorTag1', connected: false, ledOn: false, buttonPressed: true},
  	{id: '01:23:45:67:89:AC', tileId: 'Tile2', name: 'TI SensorTag2', connected: true, ledOn: true, buttonPressed: true},
  	{id: '01:23:45:67:89:AD', tileId: 'Tile3', name: 'TI SensorTag3', connected: false, ledOn: false, buttonPressed: true},
  ]);

  /**
   * Returns the list of devices currently stored
   */
  getDevices = (): Device[] => {
    //alert('providing devices from devicesService: ' + this.devices.toString())
  	return this.devices;
  };

  /**
   * Converts the device discovered by ble into a device on the tiles format
   * @param {any} bleDevice - the returned device from the ble scan
   */
  convertBleDeviceToDevice = (bleDevice: any): Promise<Device>  => {
    return this.storage.get(bleDevice.name).then( name => {
      return {
        id: bleDevice.id,
        tileId: bleDevice.name,
        name: name !== null ? name : bleDevice.name,
        connected: false, 
        ledOn: false,
        buttonPressed: false
      };
    }).catch(err => {
      return {
        id: bleDevice.id,
        tileId: bleDevice.name,
        name: bleDevice.name,
        connected: false, 
        ledOn: false,
        buttonPressed: false
      };
    })
  };

  /**
   * Adds a new device to the list of devices
   * @param {Device} device - the device to add
   */
  newDevice = (device: Device) => {
    if (this.isNewDevice(device)){
      this.devices.push(device);
      //alert('device added: ' + JSON.stringify(device));
    }
  };

  /**
   * Check if a device already exists among the stored ones
   * @param {any} device - The device to check
   */
  isNewDevice = (device: any): boolean => {
    return !this.devices.map(storedDevice => storedDevice.tileId).includes(device.tileId);
  };

  /**
   * Sets a custom name for the device
   * @param {Device} device - a tile device
   * @param {string} name - the new name for the device
   */
  setCustomDeviceName = (device: Device, name: string): void => {
    this.storage.set(device.tileId, name);
    for(let d of this.devices) {
      if(d.tileId == device.tileId) {
        d.name = name;
      }
    }
    this.events.publish('updateDevices');
  };

  /**
   * Go through the list of registered devices and keep only those connected
   */
  clearDisconnectedDevices = (): void => {
    for(let i = 0; i < this.devices.length; i++) {
      const device = this.devices[i];
      if (device.connected == false) {
        this.devices.splice(i, 1);
      }
    }
  };
};

export default {DevicesService, Device};
