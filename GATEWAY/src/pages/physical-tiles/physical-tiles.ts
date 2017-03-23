import { Component } from '@angular/core';
import { AlertController, Events, NavController, Platform } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import { Http } from '@angular/http';
import { BleService } from '../../providers/ble.service';
import { DevicesService } from '../../providers/devices.service';
import { MqttClient } from '../../providers/mqttClient';
import { Device, UtilsService, VirtualTile } from '../../providers/utils.service';


@Component({
  selector: 'page-physical-tiles',
  templateUrl: 'physical-tiles.html',
  providers: [
    BleService,
    DevicesService,
    MqttClient,
    UtilsService,
  ],
})
export class PhysicalTilesPage {
  devices: Device[];
  serverConnectStatusMsg: string;
  statusMsg: string;
  bleScanner: Subscription;
  virtualTiles: VirtualTile[];
  applications: Object[];

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public platform: Platform,
              private events: Events,
              private http: Http,
              private bleService: BleService,
              private devicesService: DevicesService,
              private mqttClient: MqttClient,
              private utils: UtilsService) {
    this.setDevices();

    this.events.subscribe('serverConnected', () => {
      this.serverConnectStatusMsg = 'Connected to server';
      // Scans for new devices once, and then every 30 seconds
      this.scanForNewBLEDevices();
      this.bleScanner = Observable.interval(30000).subscribe(res => {
        this.scanForNewBLEDevices();
      });
    });

    this.events.subscribe('offline', () => {
      this.mqttClient.setMqttConnectionStatus(false);
      this.serverConnectStatusMsg = 'Client gone offline';
      if (this.bleScanner !== undefined) {
        this.bleScanner.unsubscribe();
      }
    });

    this.events.subscribe('updateDevices', () => {
      this.setDevices();
    });
  }

  /**
   * Set the devices equal to the devices from devicesservice
   */
  setDevices = (): void => {
    this.devices = this.devicesService.getDevices();
  }

  /**
   * Use ble to discover new devices
   */
  scanForNewBLEDevices = (): void => {
    this.statusMsg = 'Searching for devices...';
    this.devicesService.clearDisconnectedDevices();
    this.bleService.scanForDevices(this.virtualTiles);
    this.setDevices();
  }

  /**
   * Called when the refresher is triggered by pulling down on the view of
   * the devices. TODO: Not sure if needed when refresh is done every 30s anyways.
   */
  refreshDevices = (refresher): void => {
    console.log('Scanning for more devices...');
    this.scanForNewBLEDevices();
    //Makes the refresher run for 2 secs
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  };

  /**
   * Triggers an event on a tile to identify which tile is which
   * @param {Device} device - A tile
   */
  identifyDevice = (device: Device): void => {
    this.bleService.sendData(device, 'led,on,red');
    setTimeout(()=> (this.bleService.sendData(device, 'led,off')), 3000);
  }

  /**
   * Called when the rename button is pushed on the view of the the
   * the devices.
   * @param {Device} device - the target device
   */
  changeNamePop = (device: Device): void => {
    this.alertCtrl.create({
      title: 'Change tile name',
      inputs: [{
        name: 'newName',
        placeholder: 'new name',
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      },
        {
          text: 'Rename',
          handler: data => {
            this.devicesService.setCustomDeviceName(device, data.newName);
          },
        }],
    }).present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhysicalTilesPage');
  }
}
