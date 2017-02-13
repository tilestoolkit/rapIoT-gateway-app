import { Injectable } from '@angular/core';

// Class for the devices, this makes it possible to specify the
// device type in typescript to avoid getting invalid device-objects
export class Device {
  id: string;
  name: string;
  connected: boolean;
  ledOn: boolean;
}

@Injectable()
export class DevicesService {
	devices: Device[];

  constructor() {
    this.devices = [];
  };

  getMockDevices = (): Device[] => ([
  	{id: '01:23:45:67:89:AB', name: 'TI SensorTag1', connected: false, ledOn: false},
  	{id: '01:23:45:67:89:AC', name: 'TI SensorTag2', connected: true, ledOn: true},
  	{id: '01:23:45:67:89:AD', name: 'TI SensorTag3', connected: false, ledOn: false},
  ]);

  getDevices = (): Device[] => {
    alert('providing devices from devicesService: ' + this.devices.toString())
  	return this.devices;
  };

  newDevice = (device: Device) => {
    if (!this.devices.includes(device)){
      this.devices.push(device);
      alert('device added: ' + JSON.stringify(device));
    }
  };

  convertBleDeviceToDevice = (bleDevice: any): Device  => {
    /*const device: Device = {
      id: '01:23:45:67:89:AB', 
      name: 'TI SensorTag1', 
      connected: false, 
      ledOn: false
    };*/
    const device = {
      id: bleDevice.id,
      name: (bleDevice.name ? bleDevice.name : 'NoName'),
      connected: false, 
      ledOn: false
    }

    return device;
  };
}
