import { Component } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Events, Platform } from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';
import { Observable } from 'rxjs/Observable';

import { TabsPage } from '../pages/tabs/tabs';
import { BleService } from '../providers/ble.service';
import { DevicesService } from '../providers/devices.service';
import { MqttClient } from '../providers/mqttClient';
import { CommandObject, UtilsService } from '../providers/utils.service';


@Component({
  providers: [
    BleService,
    DevicesService,
    UtilsService,
  ],
  templateUrl: 'app.html',
})
export class Tiles {
  private rootPage = TabsPage; // tslint:disable-line

  constructor(private backgroundMode: BackgroundMode,
              private events: Events,
              private platform: Platform,
              private bleService: BleService,
              private devicesService: DevicesService,
              private mqttClient: MqttClient,
              private utils: UtilsService ) {

    this.backgroundMode.enable();

    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    this.mqttClient.eventTransmitter.subscribe(event => {
      switch(event.topic) {
        case 'mqtt:command':
          const devices = this.devicesService.getDevices();
          for (let device of devices) {
            if (device.tileId === event.deviceId) {
              const commandString = this.utils.getCommandObjectAsString(event.command);
              this.bleService.sendData(device, commandString);
            }
          }
        case 'mqtt:serverConnected':
          this.bleService.startBLEScanner();
        case 'mqtt:offline':
          this.bleService.stopBLEScanner();
      }
    });
  }
}
