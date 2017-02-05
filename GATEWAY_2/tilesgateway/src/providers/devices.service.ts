import { Injectable } from '@angular/core';


// Class for the devices, this makes it possible to specify the 
// device type in typescript to avoid getting invalid device-objects
export class Device {
  id: string;
  name: string;
  connected: boolean;
  ledOn: boolean;
};


@Injectable()
export class DevicesService {

	devices: Device[];

  constructor() {
  };

  getMockDevices = (): Device[] => ([
  	{id: '01:23:45:67:89:AB', name: 'TI SensorTag1', connected: false, ledOn: false},
  	{id: '01:23:45:67:89:AC', name: 'TI SensorTag2', connected: true, ledOn: true},
  	{id: '01:23:45:67:89:AD', name: 'TI SensorTag3', connected: false, ledOn: false},
  ]);

  getDevices = (): Device[] => {
  	return this.devices;
  }

  newDevice = (device: Device) => {
  	this.devices.push(device);
  }

};
