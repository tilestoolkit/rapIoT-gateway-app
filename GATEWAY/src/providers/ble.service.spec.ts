import { inject, TestBed, async } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Storage } from '@ionic/storage';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import { BLE } from '@ionic-native/ble';
import { Diagnostic } from '@ionic-native/diagnostic';
import { App, Config, AlertController, Platform, Events } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import { BleService } from './ble.service';
import { DevicesService }from './devices.service';
import { StorageMock, BackgroundFetchMock, BLEMock, DiagnosticMock } from '../mocks';
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
        App,
        Config,
        Platform,
        Events,
        DevicesService,
        UtilsService,
        TilesApi,
        MqttClient,
        BleService,
        AlertController,
        {
        provide: Diagnostic,
        useClass: DiagnosticMock
        },
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
      ],
    });
  });

  beforeEach(inject([BleService], (temp: BleService) => {
    bleService = temp;
    let spyError = spyOn(bleService.errorAlert, "present");
  }));

  afterEach(() => {
    bleService = null;
  });

  it('should create an instance of the BleService', () => {
    expect(bleService).toBeTruthy;
  });

  xdescribe('startBLEScanner(): void', () => {
    it('should scan for BLE devices, and start a scanner that scans for new BLE devices', () => {
      spyOn(bleService, 'scanBLE').and.returnValue(Observable.of(bleReturnValue));

      bleService.startBLEScanner();

      expect(bleService['scanBLE']).toHaveBeenCalled();
      expect(bleService.bleScanner).toBeDefined();
    });
  });

  xdescribe('stopBLEScanner(): void', () => {
    it('should unsubscribe bleScanner if defined', () => {
      bleService.startBLEScanner();
      spyOn(bleService.bleScanner, 'unsubscribe');

      bleService.stopBLEScanner();

      expect(bleService.bleScanner['unsubscribe']).toHaveBeenCalled();
    });

    /**
     * Can not test for method to do nothing if bleScanner is undefined
     * Throws unavoidable errors
     */

  });

  xdescribe('scanForDevices(): void', () => {

    //Test funker egentlig ikke. Gir feil om man forsøker med 2 eller flere devices
    it('should clear disconnected devices before scanning for new ble devices', () => {
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);
      bleService.devicesService.devices = [tempDevice];
      spyOn(bleService.devicesService, 'clearDisconnectedDevices').and.callThrough();

      bleService.scanForDevices();

      expect(bleService.devicesService['clearDisconnectedDevices']).toHaveBeenCalled();
      expect(bleService.devicesService.devices.length).toEqual(0);
    });

    it('should check if BLE is enabled', () => {
      spyOn(bleService.ble, 'isEnabled').and.callThrough();

      bleService.scanForDevices();

      expect(bleService.ble['isEnabled']).toHaveBeenCalled();
    });
    
    //TODO: Ferdigstill denne metoden
    it('should invoke the method scanBLE() if BLE is enabled', (() => {
      let spyEnabled = spyOn(bleService.ble, 'isEnabled').and.callThrough();
      let spyScan = spyOn(bleService, 'scanBLE').and.callThrough();
      //let spyError = spyOn(bleService.errorAlert, "present");

      let bleScanForDevices = (): Promise<any> => { return new Promise( () => {
                                  bleService.scanForDevices();
                              })};

      bleScanForDevices().then( res => {
        expect(spyEnabled).toHaveBeenCalled();
        expect(spyScan).toHaveBeenCalled();
      });
    }));

    //TODO: Ferdigstill denne metoden
    it('should try to enable BLE if method isEnabled throws an error', (() => {
      let spyIsEnabled = spyOn(bleService.ble, 'isEnabled').and.callFake( (resolve, reject) => {
        return new Promise( () => {
          reject();
        });
      });
      let spyScan = spyOn(bleService, 'scanBLE').and.callThrough();
      let spyEnable = spyOn(bleService.ble, 'enable').and.callThrough();
      //let spyError = spyOn(bleService.errorAlert, "present");

      let bleScanForDevices = (): Promise<any> => { return new Promise( () => {
                                  bleService.scanForDevices();
                              })};

      bleScanForDevices().then( res => {
        expect(spyEnable).toHaveBeenCalled();
      });
    }));

    //TODO: Ferdigstill denne metoden
    it('should invoke method scanBLE() if it successfully enables BLE', (() => {
      let spyIsEnabled = spyOn(bleService.ble, 'isEnabled').and.callFake( (resolve, reject) => {
        return new Promise( () => {
          reject();
        });
      });
      let spyScan = spyOn(bleService, 'scanBLE').and.callThrough();
      let spyEnable = spyOn(bleService.ble, 'enable').and.callThrough();
      //let spyError = spyOn(bleService.errorAlert, "present");

      let bleScanForDevices = (): Promise<any> => { return new Promise( () => {
                                  bleService.scanForDevices();
                              })};

      bleScanForDevices().then( res => {
        expect(spyScan.calls.count()).toEqual(1);
      });
    }));

    //TODO: Ferdigstill denne metoden
    it('should present the error message if method enable() throws an error', (() => {
      let spyIsEnabled = spyOn(bleService.ble, 'isEnabled').and.callFake( (resolve, reject) => {
        return new Promise( () => {
          reject();
        });
      });
      let spyScan = spyOn(bleService, 'scanBLE').and.callThrough();
      let spyEnable = spyOn(bleService.ble, 'enable').and.callFake( (resolve, reject) => {
        return new Promise( () => {
          reject();
        });
      });
      //let spyError = spyOn(bleService.errorAlert, "present");

      let bleScanForDevices = (): Promise<any> => { return new Promise( () => {
                                  bleService.scanForDevices();
                              })};

      bleScanForDevices().then( res => {
        expect(spyError).toHaveBeenCalled();
      });
    }));

  });

  describe('connect(device: Device): void', () => {

    it('should run method startDeviceNotification if ble.connect returns no error', () => {
      spyOn(bleService.ble, 'connect').and.returnValue(Observable.of(testDevice));
      spyOn(bleService, 'startDeviceNotification');
      spyOn(bleService.devicesService, 'clearDisconnectedDevices');
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);

      bleService.connect(tempDevice);

      expect(bleService.ble.connect).toHaveBeenCalled();
      expect(bleService.startDeviceNotification).toHaveBeenCalled();
      expect(bleService.devicesService.clearDisconnectedDevices).not.toHaveBeenCalled();
    });

    it('should run method devicesService.clearDisconnectedDevices if ble.connect returns an error', () => {
      spyOn(bleService.ble, 'connect').and.returnValue(Observable.throw(new Error()));
      spyOn(bleService, 'startDeviceNotification');
      spyOn(bleService.devicesService, 'clearDisconnectedDevices');
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);

      bleService.connect(tempDevice);

      expect(bleService.ble.connect).toHaveBeenCalled();
      expect(bleService.startDeviceNotification).not.toHaveBeenCalled();
      expect(bleService.devicesService.clearDisconnectedDevices).toHaveBeenCalled();
    });

  });

  describe('locate(device: Device): void', () => {

    it('should run the method sendData if ble.connect returns no error', () => {
      spyOn(bleService.ble, 'connect').and.returnValue(Observable.of(testDevice));
      spyOn(bleService, 'sendData');
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);

      bleService.locate(tempDevice);

      expect(bleService.ble.connect).toHaveBeenCalled();
      expect(bleService.sendData).toHaveBeenCalled();
    });

    it('should not run the method sendData if ble.connect returns an error', () => {
      spyOn(bleService.ble, 'connect').and.returnValue(Observable.throw(new Error()));
      spyOn(bleService, 'sendData');
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);

      bleService.locate(tempDevice);

      expect(bleService.ble.connect).toHaveBeenCalled();
      expect(bleService.sendData).not.toHaveBeenCalled();
    });

  });

  describe('disconnect(device: Device): void', () => {
    it('should disconnect from the current device if it is paired', () => {
      spyOn(bleService.ble, 'disconnect').and.callThrough();
      testDevice.conncted = true;

      bleService.disconnect(testDevice);

      expect(bleService.ble.disconnect).toHaveBeenCalled();
      expect(testDevice.connected).toEqual(false);
    });
  });

  describe('sendData(device: Device, dataString: string): void', () => {
    it('should successfully send a dataString to a device using BLE', () => {
      spyOn(bleService.ble, 'writeWithoutResponse').and.callThrough();

      bleService.sendData(testDevice, 'led,on,red');

      expect(bleService.ble.writeWithoutResponse).toHaveBeenCalled();
    });
  });

  describe('scanBLE(): void', () => {

    it('should run functions ble.scan and devicesService.convertBleDeviceToDevice', () => {
      spyOn(bleService.ble, 'scan').and.returnValue(Observable.of(bleReturnValue));
      spyOn(bleService.devicesService, 'convertBleDeviceToDevice').and.callThrough();

      let tempArray = bleService.scanBLE();

      expect(bleService.ble.scan).toHaveBeenCalled();
      expect(bleService.devicesService.convertBleDeviceToDevice).toHaveBeenCalled();
    });

  });

  describe('startDeviceNotification(device: Device): void', () => {

    it('should run the method utils.getEventStringAsObject and mqttClient.sendEvent if ble.startNotification returns no error and message is not null', () => {
      spyOn(bleService.ble, 'startNotification').and.returnValue(Observable.of('led,on,red'));
      spyOn(bleService.utils, 'getEventStringAsObject').and.callFake( () => {
        let comparisonCmdObj = new CommandObject('led', ['on', 'red']);
        return comparisonCmdObj;
      });
      spyOn(bleService.mqttClient, 'sendEvent');
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);

      bleService.startDeviceNotification(tempDevice);

      expect(bleService.ble.startNotification).toHaveBeenCalled();
      expect(bleService.utils.getEventStringAsObject).toHaveBeenCalled();
      expect(bleService.mqttClient.sendEvent).toHaveBeenCalled();
    });

    it('should run the method utils.getEventStringAsObject but not the method mqttClient.sendEvent if ble.startNotification returns no error, but message is null', () => {
      spyOn(bleService.ble, 'startNotification').and.returnValue(Observable.of('led,on,red'));
      spyOn(bleService.utils, 'getEventStringAsObject').and.callThrough();
      spyOn(bleService.mqttClient, 'sendEvent');
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);

      bleService.startDeviceNotification(tempDevice);

      expect(bleService.ble.startNotification).toHaveBeenCalled();
      expect(bleService.utils.getEventStringAsObject).toHaveBeenCalled();
      expect(bleService.mqttClient.sendEvent).not.toHaveBeenCalled();
    });

    it('should not run  method utils.getEventStringAsObject and mqttClient.sendEvent if ble.startNotification returns an error', () => {
      spyOn(bleService.ble, 'startNotification').and.returnValue(Observable.throw(new Error()));
      spyOn(bleService.utils, 'getEventStringAsObject');
      spyOn(bleService.mqttClient, 'sendEvent');
      let tempDevice = new Device('test', 'test', 'test', false, (new Date()).getTime() - 61000);

      bleService.startDeviceNotification(tempDevice);

      expect(bleService.ble.startNotification).toHaveBeenCalled();
      expect(bleService.utils.getEventStringAsObject).not.toHaveBeenCalled();
      expect(bleService.mqttClient.sendEvent).not.toHaveBeenCalled();
    });

  });

});
