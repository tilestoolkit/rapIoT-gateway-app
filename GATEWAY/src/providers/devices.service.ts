import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * Class for the devices, this makes it possible to specify the
 * device type in typescript to avoid getting invalid device-objects
 */
export class Device {
  id: string;
  name: string;
  connected: boolean;
  ledOn: boolean;
  buttonPressed?: boolean;
}

@Injectable()
export class DevicesService {
	devices: Device[];

  constructor(public storage: Storage) {
    this.devices = [];
  };

  /**
   * Returns mock devices for testing purposes
   */
  getMockDevices = (): Device[] => ([
  	{id: '01:23:45:67:89:AB', name: 'TI SensorTag1', connected: false, ledOn: false, buttonPressed: true},
  	{id: '01:23:45:67:89:AC', name: 'TI SensorTag2', connected: true, ledOn: true, buttonPressed: true},
  	{id: '01:23:45:67:89:AD', name: 'TI SensorTag3', connected: false, ledOn: false, buttonPressed: true},
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
    return this.storage.get(bleDevice.id).then( name => {
      return {
        id: bleDevice.id,
        name: name !== null ? name : bleDevice.name,
        connected: false, 
        ledOn: false,
        buttonPressed: false
      };
    }).catch(err => {
      return {
        id: bleDevice.id,
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
    return !this.devices.map(storedDevice => storedDevice.id).includes(device.id);
  };

  /**
   * Sets a custom name for the device
   * @param {Device} device - a tile device
   * @param {string} name - the new name for the device
   */
  setCustomDeviceName = (device: Device, name: string): void => {
    this.storage.set(device.id, name);
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
