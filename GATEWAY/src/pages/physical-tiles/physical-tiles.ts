import { Component } from '@angular/core';
import { AlertController, Events, NavController } from 'ionic-angular';
import { BleService } from '../../providers/ble.service';
import { DevicesService } from '../../providers/devices.service';
import { Device } from '../../providers/utils.service';


@Component({
  selector: 'page-physical-tiles',
  templateUrl: 'physical-tiles.html',
})
export class PhysicalTilesPage {
  devices: Device[];

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private events: Events,
              private bleService: BleService,
              private devicesService: DevicesService) {
    this.events.subscribe('updateDevices', () => {
      this.devices = this.devicesService.getDevices();
    });
  }

  /**
   * Called when the refresher is triggered by pulling down on the view of
   * the devices.
   */
  refreshDevices = (refresher): void => {
    this.bleService.checkBleEnabled().then(res => {
      this.bleService.scanBLE();
    });
    // Makes the refresher run for 1.25 secs
    setTimeout(() => {
      refresher.complete();
    }, 1250);
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
        placeholder: 'New name',
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


  /**
   * Called when the page has entered. Updates devices list
   */
  ionViewWillEnter = () => {
    this.devices = this.devicesService.getDevices();
    this.bleService.checkBleEnabled();
  }
}
