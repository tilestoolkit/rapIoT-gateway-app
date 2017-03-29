import { inject, TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { DevicesService }from './devices.service';
import { Device } from './utils.service';
import { StorageMock } from '../mocks';

import * as tilesDevice from '../fixtures/tilesDevice.json';
import * as bleDevice from '../fixtures/bleDevice.json';

describe('devicesService:', () => {

  let devicesService: DevicesService = null;
  let deviceOne: Device = null;
  let deviceTwo: Device = null;
  let convertedBle = new Device;
      convertedBle.tileId = 'Tile_9e';
      convertedBle.name = 'Tile_9e';
      convertedBle.id = '01:23:45:67:89:AB';
      convertedBle.connected = false;
      convertedBle.ledOn = false;
      convertedBle.buttonPressed = false;
      convertedBle.connected = false;
      convertedBle.ledOn = false;
      convertedBle.buttonPressed = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Events,
        {
          provide: Storage,
          useClass: StorageMock
        },
        DevicesService,
      ],
    });
  });

  beforeEach( inject([DevicesService], (temp: DevicesService) => {
    devicesService = temp;
    deviceOne = tilesDevice;
    deviceTwo = tilesDevice;
    deviceTwo.id = '01:23:45:67:89:CB';
  }));

  afterEach(() => {
    devicesService = null;
    deviceOne = null;
    deviceTwo = null;
  });

  it('should create an instance of the DevicesService', () => {
    expect(devicesService).toBeTruthy;
  });

  describe('getDevices()', () => {

    it('should initiate with an empty devices-list', () => {
      let devicesList = devicesService.getDevices();
      expect(devicesList.length).toEqual(0);
    });

  });
  // Needs to be changed. not an aqurate test.
  describe('convertBleDeviceToDevice(bleDevice: any): Promise<Device>', () => {
    it('should convert a given BLE Device parameter to a Device', done => {
      const testBLE = bleDevice;
      // let returnedDevice =
      devicesService.convertBleDeviceToDevice(testBLE)
      .then(returnedDevice => {
        expect(returnedDevice).toEqual(convertedBle);
        done();
      });

    });

  });

  describe('newDevice(device: Device)', () => {

    it('should add a device to the devices-list if the list does not already contain the device parameter', () => {
      let devicesListOldLength = devicesService.getDevices().length;
      devicesService.newDevice(tilesDevice);
      let devicesListNewLength = devicesService.getDevices().length;
      expect(devicesListNewLength).toEqual(devicesListOldLength + 1);
    });

    it('should not add a device to the devices-list if the list already contains the device parameter', () => {
      devicesService.newDevice(tilesDevice);
      let devicesListOldLength = devicesService.getDevices().length;
      devicesService.newDevice(tilesDevice);
      let devicesListNewLength = devicesService.getDevices().length;
      expect(devicesListNewLength).toEqual(devicesListOldLength);
    });

  });

  describe('isNewDevice(device: Device): boolean', () => {

    it('should return true if the devices-list does not contain the device-parameter', () => {
      devicesService.newDevice(deviceOne);
      expect(devicesService.isNewDevice(deviceTwo)).toBeTruthy;
    });

    it('should return false if the devices-list contains the device-parameter', () => {
      devicesService.newDevice(deviceOne);
      expect(devicesService.isNewDevice(deviceTwo)).toBeFalsy;
    });

  });

  describe('setCustomDeviceName(device: Device, name: String): void', () => {

    it('should change the name of the device parameter to the name parameter', () => {
      devicesService.newDevice(deviceOne);
      devicesService.setCustomDeviceName(deviceOne, 'NewName');
      expect(devicesService.getDevices()[0].name).toEqual('NewName');
    });

  });

  describe('resetDeviceName(device: Device): void', () => {

    it('should reset the name of the device parameter to the tileId', () => {
      const oldName = 'Tile1';
      console.log(oldName);
      devicesService.newDevice(deviceOne);
      devicesService.setCustomDeviceName(deviceOne, 'NewName');
      devicesService.resetDeviceName(deviceOne);
      expect(devicesService.getDevices()[0].tileId).toEqual(oldName);
    });
  });

  describe('clearDisconnectedDevices(): void', () => {
    it('should remove the unconnected devices from devices list', () => {
      deviceOne.connected = true;
      devicesService.newDevice(deviceOne);
      devicesService.newDevice(deviceTwo);
      devicesService.clearDisconnectedDevices();
      expect(devicesService.getDevices().length).toEqual(1);
    });
  });

});
