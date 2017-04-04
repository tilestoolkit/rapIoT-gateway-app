import { inject, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Storage } from '@ionic/storage';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import { BLE } from '@ionic-native/ble';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs';
import { BleService } from './ble.service';
import { DevicesService }from './devices.service';
import { StorageMock } from '../mocks';
import { MqttClient } from './mqttClient';
import { TilesApi } from './tilesApi.service';
import { UtilsService }from './utils.service';

import * as bleReturnValue from '../fixtures/bleDevice.json';
import * as virtualTile from '../fixtures/virtualTile.json';
import * as testDevice from '../fixtures/tilesDevice.json';

describe('bleService', () => {

  let bleService: BleService = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Events,
        BackgroundFetch,
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

  describe('startBLEScanner(): void', () => {

  });

  describe('stopBLEScanner(): void', () => {

  });

  describe('scanForDevices(): void', () => {

  });

  describe('scanBLE(): void', () => {

  });

  describe('connect(device: Device): void', () => {

  });

  describe('locate(device: Device): void', () => {

  });

  describe('startDeviceNotification(device: Device): void', () => {

  });

  describe('disconnect(device: Device): void', () => {
    it('should disconnect from the current device if it is paired', () => {
      spyOn(bleService, 'disconnect').and.returnValue(Observable.of(bleReturnValue));
      bleService.disconnect(testDevice);
      expect(bleService['disconnect']).toHaveBeenCalled;
    });
  });

  describe('sendData(device: Device, dataString: string): void', () => {
    it('should successfully send a dataString to a device using BLE', () => {
      spyOn(bleService, 'sendData').and.returnValue(Observable.of(bleReturnValue));
      bleService.sendData(testDevice, 'Hello!');
      expect(bleService['sendData']).toHaveBeenCalled;
    });

    it('should not be able to send data that is not of the type string', () => {
      spyOn(bleService, 'sendData').and.returnValue(Observable.of(bleReturnValue));
      bleService.sendData(testDevice, "2345");
      expect(bleService['sendData']).not.toHaveBeenCalled;
    });
  });

});
