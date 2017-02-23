import { Injectable } from '@angular/core';

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

  constructor() {
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
   * Converts the device discovered by ble into a device on the tiles format
   * @param {any} bleDevice - the returned device from the ble scan
   */
  convertBleDeviceToDevice = (bleDevice: any): Device  => {
    /*const device: Device = {
      id: '01:23:45:67:89:AB',
      name: 'TI SensorTag1',
      connected: false,
      ledOn: false
    };*/
    const device: Device = {
      id: bleDevice.id,
      name: (bleDevice.name ? bleDevice.name : 'NoName'),
      connected: false, 
      ledOn: false,
      buttonPressed: false
    };

    return device;
  };


  /**
   * Check if a device already exists among the stored ones
   * @param {Device} device - The device to check
   */
  isNewDevice = (device: Device) => {
    return !this.devices.map(function(a) {return a.id}).includes(device.id);
  };
}

export default {DevicesService, Device};
