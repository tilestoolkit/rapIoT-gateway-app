import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { VirtualTilesPage } from '../virtual-tiles/virtual-tiles';

import { BleService } from '../../providers/ble.service';
import { DevicesService } from '../../providers/devices.service';
import { MqttClient } from '../../providers/mqttClient';
import { TilesApi } from '../../providers/tilesApi.service';
import { Application } from '../../providers/utils.service';

import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-applications',
  templateUrl: 'applications.html',
})
export class ApplicationsPage {
  applications: Application[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private bleService: BleService,
              private devicesService: DevicesService,
              private mqttClient: MqttClient,
              private tilesApi: TilesApi,
              private storage: Storage) {}

  /**
   * Called when the view is loaded to present login page if
   * the user is not logged in
   */
  ionViewDidLoad = (): void => {
    this.storage.get('loggedIn').then((val) => {
      if (val == null || val === false) {
        this.presentLoginModal();
      } else {
        this.storage.get('loginData').then((loginData) => {
          if (loginData == null ||  loginData === undefined) {
            this.presentLoginModal();
          } else {
            this.tilesApi.setLoginData(loginData);
            this.setApplications();
            this.mqttClient.connect();
          }
        });
      }
    });
  }

  /**
   * Set the list of applications from the api
   */
  setApplications = (): void => {
    this.tilesApi.getAllApplications().then(data => this.applications = data)
                                      .catch(err => console.log(err));
  }

  /**
   * Logout - empties the list of applications, changes the refreshstate
   * and presents login window.
   */
  logout = () => {
    this.storage.set('loggedIn', false);
    this.applications = [];
    this.presentLoginModal();
  }

  /**
   * Called when the refresher is triggered by pulling down on the view of
   */
  refreshApplications = (refresher): void => {
    this.setApplications();
    this.bleService.checkBleEnabled();
    // Makes the refresher symbol run for 1.25 sec
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  /**
   *  Pushes the modal on the viewStack.
   */
  presentLoginModal() {
    const modal = this.modalCtrl.create(LoginPage);
    modal.onDidDismiss(data => this.setApplications());
    modal.present();
  }

  /**
   * Pushes the virtualTilesPage on viewStack and passes the pressed
   * application ID.
   * @param {Application} application - a tiles application fetched from the api
   */
  viewApplication = (application: Application): void => {
    // Push another page onto the history stack
    // causing the nav controller to animate the new page in
    this.navCtrl.push(VirtualTilesPage, {
      app: application,
    });
  }

  /**
   * Called when the page has entered. Disconnects from connected devices
   * and clears the virtual device list of tilesApi
   */
  ionViewDidEnter = () => {
    this.tilesApi.clearVirtualTiles();
    for (let device of this.devicesService.getDevices()) {
      this.bleService.disconnect(device);
    };
  }
}
