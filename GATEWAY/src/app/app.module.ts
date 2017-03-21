import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Tiles } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ApplicationsPage } from '../pages/applications/applications'
import { DevTermPage } from '../pages/dev-term/dev-term'
import { VirtualTilesPage } from '../pages/virtual-tiles/virtual-tiles'
import { PhysicalTilesPage } from '../pages/physical-tiles/physical-tiles'


import { BleService } from '../providers/ble.service';
import { MqttClient } from '../providers/mqttClient';
import { TilesApi } from '../providers/tilesApi.service';
import { DevicesService } from '../providers/devices.service';
import { UtilsService } from '../providers/utils.service';


@NgModule({
  declarations: [
    Tiles,
    HomePage,
    TabsPage,
    LoginPage,
    DevTermPage,
    ApplicationsPage,
    VirtualTilesPage,
    PhysicalTilesPage,

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
    PhysicalTilesPage,
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Storage,
    BleService,
    DevicesService,
    MqttClient,
    TilesApi,
    UtilsService,
  ],
})

export class AppModule {}
