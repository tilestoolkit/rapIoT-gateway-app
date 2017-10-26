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
  let convertedBle = new Device('01:23:45:67:89:AB', 'Tile_9e', 'Tile_9e', false);


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
  
  describe('convertBleDeviceToDevice(bleDevice: any): Promise<Device>', () => {
    
    it('should convert a given BLE Device parameter to a Device', done => {
      const testBLE = bleDevice;
      spyOn(devicesService.storage, 'get').and.callFake( () => {
        return Promise.resolve("TestName");
      });
      
      devicesService.convertBleDeviceToDevice(testBLE)
      .then(returnedDevice => {
        expect(returnedDevice.name).toEqual("TestName");
        done();
      });
    });
    
    it('should convert a given BLE Device parameter to a Device, but use bleDevice.name if an error is thrown', done => {
      const testBLE = bleDevice;
      spyOn(devicesService.storage, "get").and.callFake( () => {
        return Promise.reject({data: {message: 'Error message'}});
      });
      
      devicesService.convertBleDeviceToDevice(testBLE)
      .then(returnedDevice => {
        expect(returnedDevice.name).toEqual(convertedBle.name);
        done();
      });
    });

  });

  describe('newDevice(device: Device)', () => {

    it('should add a device to the devices-list if the list does not already contain the device parameter', () => {
      let devicesListOldLength = devicesService.devices.length;
      devicesService.newDevice(tilesDevice);
      let devicesListNewLength = devicesService.devices.length;
      expect(devicesListNewLength).toEqual(devicesListOldLength + 1);
    });

    it('should not add a device to the devices-list if the list already contains the device parameter', () => {
      devicesService.newDevice(tilesDevice);
      let devicesListOldLength = devicesService.devices.length;
      devicesService.newDevice(tilesDevice);
      let devicesListNewLength = devicesService.devices.length;
      expect(devicesListNewLength).toEqual(devicesListOldLength);
    });

  });

  describe('setCustomDeviceName(device: Device, name: String): void', () => {

    it('should change the name of the device parameter to the name parameter', () => {
      devicesService.newDevice(deviceOne);
      devicesService.setCustomDeviceName(deviceOne, 'NewName');
      expect(devicesService.devices[0].name).toEqual('NewName');
    });

  });

  describe('resetDeviceName(device: Device): void', () => {

    it('should reset the name of the device parameter to the tileId', () => {
      const oldName = 'Tile1';
      console.log(oldName);
      devicesService.newDevice(deviceOne);
      devicesService.setCustomDeviceName(deviceOne, 'NewName');
      devicesService.resetDeviceName(deviceOne);
      expect(devicesService.devices[0].tileId).toEqual(oldName);
    });
  });

  describe('clearDisconnectedDevices(): void', () => {
    it('should remove the devices that has not been discovered for the past 60 seconds', () => {
      deviceOne.lastDiscovered = (new Date).getTime() - 61;
      deviceTwo.lastDiscovered = (new Date).getTime();
      devicesService.newDevice(deviceOne);
      devicesService.newDevice(deviceTwo);
      devicesService.clearDisconnectedDevices();
      expect(devicesService.devices.length).toEqual(1);
    });
  });

});
