import 'reflect-metadata';
import 'mocha';
import { assert, expect } from 'chai';
import { DevicesService, Device } from '../../src/providers/devices.service';


describe('DevicesService', () => {
    beforeEach( () => {
        this.devicesService = new DevicesService();
    });

  it('should have an empty list "devices" after construction', () => {
    const devices = new DevicesService();
    assert.equal(devices.getDevices().length, 0);
  });

  it('should return a list with three mock devices when running `getMockDevices()`', () => {
    const devices = this.devicesService.getMockDevices();
    assert.equal(devices.length, 3);
  });

  it('should have one more device in "devices" after running newDevice(device)', () => {
    const device: Device = {id: '01:23:45:67:89:AB', name: 'TI SensorTag1', connected: false, ledOn: false, buttonPressed: true};
    this.devicesService.newDevice(device);
    assert.equal(this.devicesService.getDevices().length, 1);
  });

  it('should return true since the device is not allready in the devices list', () => {
    const device: Device = {id: '01:23:45:67:89:AB', name: 'TI SensorTag1', connected: false, ledOn: false, buttonPressed: true};
    assert.equal(this.devicesService.isNewDevice(device), true);
  });

  it('should return false since the device is allready in the devices list', () => {
    const firstDevice: Device = {id: '01:23:45:67:89:AB', name: 'TI SensorTag1', connected: false, ledOn: false, buttonPressed: true};
    this.devicesService.newDevice(firstDevice);
    const secondDevice: Device = {id: '01:23:45:67:89:AB', name: 'TI SensorTag1', connected: false, ledOn: false, buttonPressed: true};
    assert.equal(this.devicesService.isNewDevice(secondDevice), false);
  });

  it('should return an object of type Device when converting a BLE-device with method convertBleDeviceToDevice()', () => {
    const bleDevice = {"id" : "01:23:45:67:89:AB", "advertising" : {}, "rssi" : -99};
    const device = this.devicesService.convertBleDeviceToDevice(bleDevice);
    assert.typeOf(device, 'Device', "this is a Device");
  });
});
