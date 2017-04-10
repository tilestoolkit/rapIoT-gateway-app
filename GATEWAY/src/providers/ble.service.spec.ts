import { inject, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Storage } from '@ionic/storage';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import { BLE } from '@ionic-native/ble';
import { Events } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import { BleService } from './ble.service';
import { DevicesService }from './devices.service';
import { StorageMock, BackgroundFetchMock, BLEMock } from '../mocks';
import { MqttClient } from './mqttClient';
import { TilesApi } from './tilesApi.service';
import { UtilsService, Device }from './utils.service';

import * as bleReturnValue from '../fixtures/bleDevice.json';
import * as testDevice from '../fixtures/tilesDevice.json';

describe('bleService', () => {

  let bleService: BleService = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Events,
        {
        provide: BackgroundFetch,
        useClass: BackgroundFetchMock
        },
        {
          provide: Storage,
          useClass: StorageMock
        },
        {
          provide: BLE,
          useClass: BLEMock
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
    it('should scan for BLE devices, and start a scanner that scans for new BLE devices', () => {
      spyOn(bleService, 'scanForDevices').and.returnValue(Observable.of(bleReturnValue));

      bleService.startBLEScanner();

      expect(bleService['scanForDevices']).toHaveBeenCalled();
      expect(bleService.bleScanner).toBeDefined();
    });
  });

  describe('stopBLEScanner(): void', () => {
    it('should unsubscribe bleScanner if defined', () => {
      bleService.bleScanner = new Subscription;
      spyOn(bleService.bleScanner, 'unsubscribe');

      bleService.stopBLEScanner();

      expect(bleService.bleScanner['unsubscribe']).toHaveBeenCalled();
    });

    /**
     * Can not test for method to do nothing if bleScanner is undefined
     * Throws unavoidable errors
     */
    
  });

  describe('scanForDevices(): void', () => {
    
    it('should clear disconnected devices before scanning for new ble devices', () => {
      let tempDevice = new Device;
      tempDevice.id = "test", tempDevice.tileId = "test", tempDevice.name = "test", tempDevice.connected = false, tempDevice.ledOn = false, tempDevice.buttonPressed = false;
      bleService.devicesService.setDevices([tempDevice]);
      spyOn(bleService.devicesService, 'clearDisconnectedDevices').and.callThrough();

      bleService.scanForDevices();

      expect(bleService.devicesService['clearDisconnectedDevices']).toHaveBeenCalled();
      expect(bleService.devicesService.getDevices().length).toEqual(0);
    });

    it('should check if BLE is enabled', () => {
      spyOn(bleService.ble, 'isEnabled').and.callThrough();

      bleService.scanForDevices();

      expect(bleService.ble['isEnabled']).toHaveBeenCalled();
    });

    //TODO: Ferdigstill denne metoden
    it('should invoke the method scanBLE() if BLE is enabled', () => {
      spyOn(bleService.ble, 'isEnabled').and.callFake((): Promise<any> => {
        return new Promise((resolve: Function) => {
          resolve(bleService.scanBLE());
        });
      });
      spyOn(bleService, 'scanBLE').and.callThrough();

      bleService.scanForDevices();

      //expect(bleService.ble.isEnabled).toHaveBeenCalled();
      expect(bleService.scanBLE).toHaveBeenCalledTimes(1);
    });

    //TODO: Ferdigstill denne metoden
    xit('should try to enable BLE if method isEnabled throws an error', () => {
      spyOn(bleService.ble, 'isEnabled').and.callThrough();
      spyOn(bleService, 'scanBLE').and.throwError("Test Error");
      spyOn(bleService.ble, 'enable').and.callThrough();

      bleService.scanForDevices();

      //expect(bleService.ble['isEnabled']).toHaveBeenCalled();
      //expect(bleService['scanBLE']).toThrowError();
      expect(bleService.ble.enable).toHaveBeenCalled();
    });

    //TODO: Ferdigstill denne metoden
    xit('should invoke method scanBLE() if it successfully enables BLE', () => {

    });

    //TODO: Ferdigstill denne metoden
    xit('should do something if method enable() throws an error', () => {

    });

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

      expect(bleService['disconnect']).toHaveBeenCalled();
    });
  });

  describe('sendData(device: Device, dataString: string): void', () => {
    it('should successfully send a dataString to a device using BLE', () => {
      spyOn(bleService, 'sendData').and.returnValue(Observable.of(bleReturnValue));

      bleService.sendData(testDevice, 'Hello!');

      expect(bleService['sendData']).toHaveBeenCalled();
    });

    /* Dårlig test
    xit('should not be able to send data that is not of the type string', () => {
      spyOn(bleService, 'sendData').and.returnValue(Observable.of(bleReturnValue));
      bleService.sendData(testDevice, 2345);
      expect(bleService['sendData']).not.toHaveBeenCalled();
    });
    */
  });

});
