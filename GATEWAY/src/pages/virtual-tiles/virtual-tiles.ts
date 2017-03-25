import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

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
              public navCtrl: NavController, 
              public navParams: NavParams,
              private devicesService: DevicesService,
              private utils: UtilsService,
              private tilesApi: TilesApi,) {
  	// A id variable is stored in the navParams, and .get set this value to the local variable id
  	this.activeApp = navParams.get('app');

  	// Sets the title of the page (found in virtual-tiles.html) to id, capitalized. 
  	this.applicationTitle = utils.capitalize(this.activeApp._id);
    this.setDevices();
    this.tilesApi.setVirtualTiles(this.activeApp._id);
    this.setVirtualTiles();
  }

  /**
   * Set the devices equal to the devices from devicesservice
   */
  setDevices = (): void => {
    this.devices = this.devicesService.getDevices();
  }
  
  /**
   * Set the virtual tiles equal to the ones stores for the app
   */
  setVirtualTiles = (): void => {
    this.tilesApi.getApplicationTiles(this.activeApp._id).then(res => {
      this.virtualTiles = res;
    });
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
            this.tilesApi.pairDeviceToVirualTile(data, virtualTile._id, this.activeApp._id);
          },
      }],
    }).present();
  }
}
