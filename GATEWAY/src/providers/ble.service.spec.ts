import { inject, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TilesApi } from './tilesApi.service';
import { MqttClient } from './mqttClient';
import { BleService } from './ble.service';
import { DevicesService }from './devices.service';
import { UtilsService }from './utils.service';
import { StorageMock } from '../mocks';
import { BLE } from 'ionic-native';
import { Observable } from 'rxjs';

import * as bleReturnValue from '../fixtures/bleDevice.json';
import * as testDevice from '../fixtures/tilesDevice.json';
describe('bleService', () => {

  let bleService: BleService = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Events,
        {
          provide: Storage,
          useClass: StorageMock
        },
        MockBackend,
        BaseRequestOptions,
        {
          provide : Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
        DevicesService,
        UtilsService,
        TilesApi,
        MqttClient,
        BleService,
        BLE,
      ],
    });
  });

  beforeEach(inject([BleService], (temp: BleService) => {
    bleService = temp;
  }));

  afterEach(() => {
    bleService = null;
  });

  it('should create an instance of the BleService', () => {
    expect(bleService).toBeTruthy;
  });

  describe('scanForDevices(virtualTiles: VirtualTile[]): void', () => {
    it('should check if BLE is enabled, scan for BLE-devices and have the tilesApi convert and store them', () => {
      spyOn(bleService, 'scanBLE').and.returnValue(new Promise((resolve) => {resolve(bleReturnValue); }));
      bleService.scanForDevices([]);
      expect(bleService['scanBLE']).toHaveBeenCalled;
    });
  });

  describe('scanBLE(virtualTiles: VirtualTile[]): void', () => {
    it('should scan for BLE-devices and have the tilesApi convert and store them', () => {
      spyOn(BLE, 'scan').and.returnValue(Observable.of(bleReturnValue));
      bleService.scanBLE([]);
      expect(BLE['scan']).toHaveBeenCalled;
    });
  });

  describe('connect(device: Device): void', () => {
    it('should connect successfully to a device after being called with a Device argument', () => {
      spyOn(BLE, 'connect').and.returnValue(Observable.of(bleReturnValue));
      bleService.connect(testDevice);
      expect(BLE['connect']).toHaveBeenCalled;
    });
  });

  describe('startDeviceNotification(device: Device): void', () => {

  });

  describe('disconnect(device: Device): void', () => {

  });

  describe('sendData(device: Device, dataString: string): void', () => {

  });

});
