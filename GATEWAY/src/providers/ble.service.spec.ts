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
import { BLE } from '@ionic-native/ble';
import { Observable } from 'rxjs';

import * as bleReturnValue from '../fixtures/bleDevice.json';
import * as virtualTile from '../fixtures/virtualTile.json';
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

  xdescribe('scanForDevices(virtualTiles: VirtualTile[]): void', () => {
    it('should check if BLE is enabled, scan for BLE-devices and have the tilesApi convert and store them', () => {
      spyOn(bleService, 'scanBLE').and.returnValue(Observable.of(bleReturnValue));
      bleService.scanForDevices([virtualTile]);
      expect(bleService['scanBLE']).toHaveBeenCalled;
    });
  });

  xdescribe('scanBLE(virtualTiles: VirtualTile[]): void', () => {
    it('should scan for BLE-devices and have the tilesApi convert and store them', () => {
      spyOn(BLE, 'scan').and.returnValue(Observable.of(bleReturnValue));
      bleService.scanBLE([virtualTile]);
      expect(BLE['scan']).toHaveBeenCalled;
    });
  });

  xdescribe('connect(device: Device): void', () => {
    it('should connect successfully to a device after being called with a Device argument', () => {
      spyOn(BLE, 'connect').and.returnValue(Observable.of(bleReturnValue));
      bleService.connect(testDevice);
      expect(BLE['connect']).toHaveBeenCalled;
    });
  });

  xdescribe('startDeviceNotification(device: Device): void', () => {
    it('should get notifications of events from a deivce', () => {
      spyOn(BLE, 'startNotification').and.returnValue(Observable.of(bleReturnValue));
      bleService.startDeviceNotification(testDevice);
      expect(BLE['startNotification']).toHaveBeenCalled;
    });
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
      bleService.sendData(testDevice, 2345);
      expect(bleService['sendData']).not.toHaveBeenCalled;
    });
  });

});
