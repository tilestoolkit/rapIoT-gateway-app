import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Storage } from '@ionic/storage';
import { AlertController, IonicApp, IonicModule } from 'ionic-angular';

import { ApplicationsPage } from '../pages/applications/applications';
import { DevTermPage } from '../pages/dev-term/dev-term';
import { LoginPage } from '../pages/login/login';
import { PhysicalTilesPage } from '../pages/physical-tiles/physical-tiles';
import { TabsPage } from '../pages/tabs/tabs';
import { VirtualTilesPage } from '../pages/virtual-tiles/virtual-tiles';
import { Tiles } from './app.component';

import { BleService } from '../providers/ble.service';
import { DevicesService } from '../providers/devices.service';
import { MqttClient } from '../providers/mqttClient';
import { TilesApi } from '../providers/tilesApi.service';
import { UtilsService } from '../providers/utils.service';
import { AppProviders } from './app.providers';


@NgModule({
  bootstrap: [IonicApp],
  declarations: [
    ApplicationsPage,
    DevTermPage,
    LoginPage,
    PhysicalTilesPage,
    TabsPage,
    Tiles,
    VirtualTilesPage,
  ],
  entryComponents: [
    ApplicationsPage,
    DevTermPage,
    LoginPage,
    PhysicalTilesPage,
    TabsPage,
    Tiles,
    VirtualTilesPage,
  ],
  imports: [
    FormsModule,
    HttpModule,
    IonicModule.forRoot(Tiles),
  ],
  providers: AppProviders.getProviders().concat([
    AlertController,
    BackgroundFetch,
    Storage,
    BleService,
    DevicesService,
    Diagnostic,
    MqttClient,
    TilesApi,
    UtilsService,
  ]),
})
export class AppModule {}
