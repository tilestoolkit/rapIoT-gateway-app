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
  templateUrl: 'virtual-tiles.html'
})
export class VirtualTilesPage {
  devices: Device[];
  applicationTitle: string;
  virtualTiles: VirtualTile[];
  activeApp: Application;

  constructor(public alertCtrl: AlertController,
              public events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              public bleService: BleService,
              public devicesService: DevicesService,
              public utils: UtilsService,
              public tilesApi: TilesApi) {
    // A id variable is stored in the navParams, and .get set this value to the local variable id
    this.activeApp = navParams.get('app');
    this.tilesApi.setActiveApp(navParams.get('app'));
    // Sets the title of the page (found in virtual-tiles.html) to id, capitalized.
    this.applicationTitle = utils.capitalize(this.activeApp._id);
    this.devices = this.devicesService.getDevices();
    this.tilesApi.setVirtualTiles();
    this.setVirtualTiles();

    this.events.subscribe('updateDevices', () => {
      this.devices = this.devicesService.getDevices();
      this.setVirtualTiles();
    });
  }

  /**
   * Set the virtual tiles equal to the ones stores for the app
   */
  setVirtualTiles = (): Promise<void> => {
    this.tilesApi.getApplicationTiles().then(res => {
      this.virtualTiles = res;
    });
    return Promise.resolve(undefined);
  }

  /**
  * Called when the refresher is triggered by pulling down on the view of
  * virtualTiles
  */
  refreshVirtualTiles = (refresher): void => {
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
  pairTilePopUp = (virtualTile: VirtualTile): void => {
    const deviceRadioButtons = this.devices.map(device => {
      return {type: 'radio', name: 'deviceId', value: device.tileId, label: device.name};
    });
    if (this.devices.length > 0) {
      this.alertCtrl.create({
        title: 'Pair to physical tile',
        inputs: deviceRadioButtons,
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          },
          {
            text: 'Pair',
            handler: data => {
              this.tilesApi.pairDeviceToVirtualTile(data, virtualTile._id).then(
                res => this.setVirtualTiles()
              );
            },
        }],
      }).present();
    } else {
      this.alertCtrl.create({
        title: 'Pair to physical tile',
        message: 'No physical tiles nearby.',
        buttons: ['Dismiss']}).present();
    }
  }

  /**
   * Called when the unpair button is pushed from the
   * virtual tiles view.
   * @param {VirtualTile} virtualTile - the target device
   */
  unpairTile = (virtualTile: VirtualTile): void => {
     this.tilesApi.pairDeviceToVirtualTile(null, virtualTile._id);
     // Refreshes the lists of paired and unpaired virtual tiles
     this.setVirtualTiles();
  }

  /**
   * Called when the page has entered. Updates devices lists
   */
  ionViewDidEnter = () => {
    this.devices = this.devicesService.getDevices();
    this.setVirtualTiles();
    this.bleService.checkBleEnabled();
  }
}
