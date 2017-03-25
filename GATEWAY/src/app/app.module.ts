import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

import { Tiles } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ApplicationsPage } from '../pages/applications/applications';
import { DevTermPage } from '../pages/dev-term/dev-term'
import { VirtualTilesPage } from '../pages/virtual-tiles/virtual-tiles'
import { PhysicalTilesPage } from '../pages/physical-tiles/physical-tiles'


import { BleService } from '../providers/ble.service';
import { MqttClient } from '../providers/mqttClient';
import { TilesApi } from '../providers/tilesApi.service';
import { DevicesService } from '../providers/devices.service';
import { UtilsService } from '../providers/utils.service';




class BleMock extends BLE {

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
      , {
        "name": "Tile3",
        "id": "01:23:45:67:89:AC",
        "rssi": -79,
        "advertising": null
      }
      , {
        "name": "Tile14",
        "id": "01:23:45:67:89:AD",
        "rssi": -79,
        "advertising": null
      }

    ]
    return Observable.from(mockBle);
  }
  connect(device){
    return Observable.create(observer => {
      observer.next(42);
    }); 
  }
  startNotification(deviceId, serviceUUID, characteristicUUID) {
    return Observable.create(observer => {
      observer.next('tap,single');
    });     
  }
  disconnect(device) {
    return new Promise<void>(resolve => resolve());
  }
  writeWithoutResponse(deviceId, serviceUUID, characteristicUUID, value) {
    return new Promise<void>(resolve => resolve());
  }
}



@NgModule({
  declarations: [
    Tiles,
    HomePage,
    TabsPage,
    LoginPage,
    DevTermPage,
    ApplicationsPage,
    VirtualTilesPage,
    PhysicalTilesPage
  ],
  imports: [
    FormsModule,
    HttpModule,
    IonicModule.forRoot(Tiles),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Tiles,
    HomePage,
    TabsPage,
    LoginPage,
    DevTermPage,
    ApplicationsPage,
    VirtualTilesPage,
    PhysicalTilesPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: BLE, useClass: BleMock},
    Storage,
    BleService,
    DevicesService,
    MqttClient,
    TilesApi,
    UtilsService,
  ],
})

export class AppModule {}
