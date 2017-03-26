import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { Observable } from 'rxjs';


import { UtilsService } from './utils.service';


@Injectable()
export class BLENativeMock extends BLE {
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
        "name": "Tile1",
        "id": "01:23:45:67:89:AA",
        "rssi": -79,
        "advertising": null
      }, {
        "name": "Tile_da",
        "id": "01:23:45:67:89:AB",
        "rssi": -79,
        "advertising": null
      }
    ]
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
