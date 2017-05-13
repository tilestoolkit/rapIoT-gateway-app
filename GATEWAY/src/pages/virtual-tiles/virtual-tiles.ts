import { Component } from '@angular/core';
import { AlertController, Events, NavController, NavParams } from 'ionic-angular';

import { BleService } from '../../providers/ble.service';
import { DevicesService } from '../../providers/devices.service';
import { TilesApi } from '../../providers/tilesApi.service';
import { Application, Device, UtilsService, VirtualTile } from '../../providers/utils.service';
/*
  Generated class for the VirtualTiles page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-virtual-tiles',
  templateUrl: 'virtual-tiles.html',
})
export class VirtualTilesPage {
  public applicationTitle: string;
  public virtualTiles: VirtualTile[];
  public activeApp: Application;
  public appOnlineBtnText: string;
  private devices: Device[];

  constructor(public alertCtrl: AlertController,
              public events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              private bleService: BleService,
              private devicesService: DevicesService,
              private utils: UtilsService,
              private tilesApi: TilesApi) {
    this.appOnlineBtnText = this.activeApp.appOnline ? 'STOP APPLICATION' : 'START APPLICATION';
    this.events.subscribe('updateDevices', () => {
      this.devices = this.devicesService.getDevices();
      this.setVirtualTiles();
    });
  }

  /**
   * Called when the refresher is triggered by pulling down on the view of
   * virtualTiles
   */
  public refreshVirtualTiles = (refresher: any): void => {
    this.devices = this.devicesService.getDevices();
    this.setVirtualTiles();
    this.bleService.checkBleEnabled();
    // Makes the refresher run for 1.25 secs
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  /**
   * Called when the pair button is pushed on the view of the the
   * the virtual tiles.
   * @param {VirtualTile} virtualTile - the target device
   */
  public pairTilePopUp = (virtualTile: VirtualTile): void => {
    const deviceRadioButtons = this.devices.map(device => {
      return {type: 'radio', name: 'deviceId', value: device.tileId, label: device.name};
    });
    if (this.devices.length > 0) {
      this.alertCtrl.create({
      title: 'Pair to physical tile',
      inputs: deviceRadioButtons, // tslint:disable-line
      buttons: [{ // tslint:disable-line
        text: 'Cancel',
        role: 'cancel', // tslint:disable-line
        },
        {
          text: 'Pair',
          handler: data => { // tslint:disable-line
            this.tilesApi.pairDeviceToVirualTile(data, virtualTile._id)
                                    .then(res => this.setVirtualTiles());
          },
      }],
    }).present();
    } else {
      this.alertCtrl.create({
        buttons: ['Dismiss'],
        message: 'No physical tiles nearby.',
        title: 'Pair to physical tile' }).present();
    }
  }

  /**
   * Called when the unpair button is pushed from the
   * virtual tiles view.
   * @param {VirtualTile} virtualTile - the target device
   */
  public unpairTile = (virtualTile: VirtualTile): void => {
    this.tilesApi.pairDeviceToVirualTile(null, virtualTile._id)
                           .then(res => this.setVirtualTiles());
  }

  /**
   * Toggle the appOnline for the application on/off. change the text on the
   * button.
   */
  public toggleAppOnline = (): void => {
    this.tilesApi.toggleAppOnline(this.activeApp).then(res => {
      this.appOnlineBtnText = res.appOnline ? 'STOP APPLICATION' : 'START APPLICATION';
    });
  }

  /**
   * Called when the page has entered. Updates devices lists
   */
  public ionViewWillEnter = () => {    // A id variable is stored in the navParams, and .get set this value to the local variable id
    this.activeApp = this.navParams.get('app');
    this.tilesApi.setActiveApp(this.navParams.get('app'));
    // Sets the title of the page (found in virtual-tiles.html) to id, capitalized.
    this.applicationTitle = this.utils.capitalize(this.activeApp._id);
    this.devices = this.devicesService.getDevices();
    this.setVirtualTiles();
    this.bleService.checkBleEnabled();
  }

  /**
   * Set the virtual tiles equal to the ones stores for the app
   */
  private setVirtualTiles = (): void => {
    // We want to set the virtual tiles before getting as the database (ex pairing) might have changed
    this.tilesApi.setVirtualTiles().then(res => {
      this.virtualTiles = this.tilesApi.getVirtualTiles();
    });
  }
}
