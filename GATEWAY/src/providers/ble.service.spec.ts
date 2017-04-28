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
import { UtilsService, Device, CommandObject }from './utils.service';

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
      expect(bleService.getBleScanner).toBeDefined();
    });
  });

  describe('stopBLEScanner(): void', () => {
    it('should unsubscribe bleScanner if defined', () => {
      bleService.setBleScanner(new Subscription);
      spyOn(bleService.getBleScanner(), 'unsubscribe');

      bleService.stopBLEScanner();

      expect(bleService.getBleScanner()['unsubscribe']).toHaveBeenCalled();
    });

    /**
     * Can not test for method to do nothing if bleScanner is undefined
     * Throws unavoidable errors
     */

  });

  describe('scanForDevices(): void', () => {
    
    //Test funker egentlig ikke. Gir feil om man forsøker med 2 eller flere devices
    it('should clear disconnected devices before scanning for new ble devices', () => {
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);
      bleService.getDevicesService().devices = [tempDevice];
      spyOn(bleService.getDevicesService(), 'clearDisconnectedDevices').and.callThrough();

      bleService.scanForDevices();

      expect(bleService.getDevicesService()['clearDisconnectedDevices']).toHaveBeenCalled();
      expect(bleService.getDevicesService().devices.length).toEqual(0);
    });

    it('should check if BLE is enabled', () => {
      spyOn(bleService.getBle(), 'isEnabled').and.callThrough();

      bleService.scanForDevices();

      expect(bleService.getBle()['isEnabled']).toHaveBeenCalled();
    });

    /**
     * Disse blir vanskelige å teste
     * Blir nødt til å kjøre en hacky hack for å teste
     * Typ bool-flag som settes i hovedklassene og sjekkes etter gjennomføring
     */
    //TODO: Ferdigstill denne metoden
    xit('should invoke the method scanBLE() if BLE is enabled', () => {
      //spyOn(bleService.ble, 'isEnabled').and.callThrough();
      
      let spy = spyOn(bleService, 'scanBLE').and.callThrough();

      bleService.scanForDevices();

      //expect(bleService.ble.isEnabled).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
    });

    //TODO: Ferdigstill denne metoden
    xit('should try to enable BLE if method isEnabled throws an error', () => {
      spyOn(bleService.getBle(), 'isEnabled').and.callThrough();
      spyOn(bleService, 'scanBLE').and.throwError("Test Error");
      spyOn(bleService.getBle(), 'enable').and.callThrough();

      bleService.scanForDevices();

      //expect(bleService.ble['isEnabled']).toHaveBeenCalled();
      //expect(bleService['scanBLE']).toThrowError();
      expect(bleService.getBle().enable).toHaveBeenCalled();
    });

    //TODO: Ferdigstill denne metoden
    xit('should invoke method scanBLE() if it successfully enables BLE', () => {

    });

    //TODO: Ferdigstill denne metoden
    xit('should do something if method enable() throws an error', () => {

    });

  });

  describe('scanBLE(): void', () => {

    it('should run functions ble.scan and devicesService.convertBleDeviceToDevice', () => {
      spyOn(bleService.getBle(), 'scan').and.returnValue(Observable.of(bleReturnValue));
      spyOn(bleService.getDevicesService(), 'convertBleDeviceToDevice').and.callThrough();

      let tempArray = bleService.scanBLE();

      expect(bleService.getBle().scan).toHaveBeenCalled();
      expect(bleService.getDevicesService().convertBleDeviceToDevice).toHaveBeenCalled();
    });

  });

  describe('connect(device: Device): void', () => {

    it('should run method startDeviceNotification if ble.connect returns no error', () => {
      spyOn(bleService.getBle(), 'connect').and.returnValue(Observable.of(testDevice));
      spyOn(bleService, 'startDeviceNotification');
      spyOn(bleService.getDevicesService(), 'clearDisconnectedDevices');
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);

      bleService.connect(tempDevice);

      expect(bleService.getBle().connect).toHaveBeenCalled();
      expect(bleService.startDeviceNotification).toHaveBeenCalled();
      expect(bleService.getDevicesService().clearDisconnectedDevices).not.toHaveBeenCalled();
    });

    it('should run method devicesService.clearDisconnectedDevices if ble.connect returns an error', () => {
      spyOn(bleService.getBle(), 'connect').and.returnValue(Observable.throw(new Error()));
      spyOn(bleService, 'startDeviceNotification');
      spyOn(bleService.getDevicesService(), 'clearDisconnectedDevices');
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);

      bleService.connect(tempDevice);

      expect(bleService.getBle().connect).toHaveBeenCalled();
      expect(bleService.startDeviceNotification).not.toHaveBeenCalled();
      expect(bleService.getDevicesService().clearDisconnectedDevices).toHaveBeenCalled();
    });

  });

  describe('locate(device: Device): void', () => {

    it('should run the method sendData if ble.connect returns no error', () => {
      spyOn(bleService.getBle(), 'connect').and.returnValue(Observable.of(testDevice));
      spyOn(bleService, 'sendData');
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);

      bleService.locate(tempDevice);

      expect(bleService.getBle().connect).toHaveBeenCalled();
      expect(bleService.sendData).toHaveBeenCalled();
    });

    it('should not run the method sendData if ble.connect returns an error', () => {
      spyOn(bleService.getBle(), 'connect').and.returnValue(Observable.throw(new Error()));
      spyOn(bleService, 'sendData');
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);

      bleService.locate(tempDevice);

      expect(bleService.getBle().connect).toHaveBeenCalled();
      expect(bleService.sendData).not.toHaveBeenCalled();
    });

  });

  describe('startDeviceNotification(device: Device): void', () => {

    it('should run the method utils.getEventStringAsObject and mqttClient.sendEvent if ble.startNotification returns no error and message is not null', () => {
      spyOn(bleService.getBle(), 'startNotification').and.returnValue(Observable.of('led,on,red'));
      spyOn(bleService.getUtils(), 'getEventStringAsObject').and.callFake( () => {
        let comparisonCmdObj = new CommandObject('led', ['on', 'red']);
        return comparisonCmdObj;
      });
      spyOn(bleService.getMqttClient(), 'sendEvent');
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);

      bleService.startDeviceNotification(tempDevice);

      expect(bleService.getBle().startNotification).toHaveBeenCalled();
      expect(bleService.getUtils().getEventStringAsObject).toHaveBeenCalled();
      expect(bleService.getMqttClient().sendEvent).toHaveBeenCalled();
    });

    it('should run the method utils.getEventStringAsObject but not the method mqttClient.sendEvent if ble.startNotification returns no error, but message is null', () => {
      spyOn(bleService.getBle(), 'startNotification').and.returnValue(Observable.of('led,on,red'));
      spyOn(bleService.getUtils(), 'getEventStringAsObject').and.callThrough();
      spyOn(bleService.getMqttClient(), 'sendEvent');
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);

      bleService.startDeviceNotification(tempDevice);

      expect(bleService.getBle().startNotification).toHaveBeenCalled();
      expect(bleService.getUtils().getEventStringAsObject).toHaveBeenCalled();
      expect(bleService.getMqttClient().sendEvent).not.toHaveBeenCalled();
    });

    it('should not run  method utils.getEventStringAsObject and mqttClient.sendEvent if ble.startNotification returns an error', () => {
      spyOn(bleService.getBle(), 'startNotification').and.returnValue(Observable.throw(new Error()));
      spyOn(bleService.getUtils(), 'getEventStringAsObject');
      spyOn(bleService.getMqttClient(), 'sendEvent');
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);

      bleService.startDeviceNotification(tempDevice);

      expect(bleService.getBle().startNotification).toHaveBeenCalled();
      expect(bleService.getUtils().getEventStringAsObject).not.toHaveBeenCalled();
      expect(bleService.getMqttClient().sendEvent).not.toHaveBeenCalled();
    });

  });

  describe('disconnect(device: Device): void', () => {
    it('should disconnect from the current device if it is paired', () => {
      spyOn(bleService.getBle(), 'disconnect').and.callThrough();
      testDevice.conncted = true;

      bleService.disconnect(testDevice);

      expect(bleService.getBle().disconnect).toHaveBeenCalled();
      expect(testDevice.connected).toEqual(false);
    });
  });

  describe('sendData(device: Device, dataString: string): void', () => {
    it('should successfully send a dataString to a device using BLE', () => {
      spyOn(bleService.getBle(), 'writeWithoutResponse').and.callThrough();

      bleService.sendData(testDevice, 'led,on,red');

      expect(bleService.getBle().writeWithoutResponse).toHaveBeenCalled();
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
