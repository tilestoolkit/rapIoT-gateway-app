/* tslint:disable:max-classes-per-file */
import { ErrorHandler } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { Storage } from '@ionic/storage';
import { Events, IonicErrorHandler } from 'ionic-angular';
import { Observable } from 'rxjs';

import { UtilsService } from '../providers/utils.service';


/**
 * This is a class to mock the native BLE module for browser development.
 * This contains all BLE methods that we are using and mock responses to give
 * data to our app.
 */
class BLEMock extends BLE {
  public isEnabled() {
    return new Promise<void>(resolve => resolve());
  }
  public enable() {
    return new Promise<void>(resolve => resolve());
  }
  public scan(services, seconds) {
    const mockBle = [
      {
        advertising: null,
        id: '01:23:45:67:89:AA',
        name: 'Tile1',
        rssi: -79,
      }, {
        advertising: null,
        id: '01:23:45:67:89:AB',
        name: 'Tile_da',
        rssi: -79,
      },
    ];
    return Observable.from(mockBle);
  }
  public connect(device) {
    return Observable.create(observer => {
      observer.next();
    });
  }
  public startNotification(deviceId, serviceUUID, characteristicUUID) {
    const utils = new UtilsService(new Storage(), new Events());
    return Observable.create(observer => {
      observer.next(utils.convertStringtoBytes('tap,single.'));
    });
  }
  public disconnect(device) {
    return new Promise<void>(resolve => resolve());
  }
  public writeWithoutResponse(deviceId, serviceUUID, characteristicUUID, value) {
    return new Promise<void>(resolve => resolve());
  }
}

/**
 * Class that checks if the app is running in the browser and uses the mock classes for native code if it is.
 */
export class AppProviders {
  public static getProviders() {
    let providers;
    if (document.URL.includes('https://') || document.URL.includes('http://')) {
      // Use browser providers
      providers = [
        {provide: BLE, useClass: BLEMock},
        {provide: ErrorHandler, useClass: IonicErrorHandler},
      ];
    } else {
      // Use the standard platform providers
      providers = [
        BLE,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
      ];
    }
    return providers;
  }
}
