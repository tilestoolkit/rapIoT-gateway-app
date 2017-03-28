import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { Observable } from 'rxjs';

import { UtilsService } from '../providers/utils.service';


class BLEMock extends BLE {
  constructor(private utils: UtilsService){
    super();
  }
  isEnabled() {
    return new Promise<void>(resolve => resolve());
  }
  enable() {
    return new Promise<void>(resolve => resolve());
  }
  scan(services, seconds) {
    const mockBle = [
      {
        'name': 'Tile1',
        'id': '01:23:45:67:89:AA',
        'rssi': -79,
        'advertising': null
      }, {
        'name': 'Tile_da',
        'id': '01:23:45:67:89:AB',
        'rssi': -79,
        'advertising': null
      }
    ];
    return Observable.from(mockBle);
  }
  connect(device){
    return Observable.create(observer => {
      observer.next();
    });
  }
  startNotification(deviceId, serviceUUID, characteristicUUID) {
    return Observable.create(observer => {
      observer.next(this.utils.convertStringtoBytes('tap,single.'));
    });
  }
  disconnect(device) {
    return new Promise<void>(resolve => resolve());
  }
  writeWithoutResponse(deviceId, serviceUUID, characteristicUUID, value) {
    return new Promise<void>(resolve => resolve());
  }
}



export class AppProviders {

  public static getProviders() {

    let providers;

    if (document.URL.includes('https://') || document.URL.includes('http://')){

      // Use browser providers
      providers = [
        {provide: BLE, useClass: BLEMock},
        {provide: ErrorHandler, useClass: IonicErrorHandler}
      ];

    } else {

      // Use device providers
      providers = [
        BLE,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
      ];

    }

    return providers;

  }

}