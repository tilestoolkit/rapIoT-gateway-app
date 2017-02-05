import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Tiles } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';

import { BleService } from '../providers/ble.service';
import { MqttClient } from '../providers/mqttClient';
import { TilesApi } from '../providers/tilesApi.service';


@NgModule({
  declarations: [
    Tiles,
    HomePage,
    TabsPage
  ],
  imports: [
    HttpModule,
    IonicModule.forRoot(Tiles)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Tiles,
    HomePage,
    TabsPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Storage,
    BleService,
    MqttClient,
    TilesApi
  ]
})
export class AppModule {}
