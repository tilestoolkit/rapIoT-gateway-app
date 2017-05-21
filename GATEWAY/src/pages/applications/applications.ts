import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, NavController, NavParams } from 'ionic-angular';

import { BleService } from '../../providers/ble.service';
import { DevicesService } from '../../providers/devices.service';
import { LoginPage } from '../login/login';
import { MqttClient } from '../../providers/mqttClient'; // tslint:disable-line
import { TilesApi } from '../../providers/tilesApi.service';
import { Application } from '../../providers/utils.service';

import { VirtualTilesPage } from '../virtual-tiles/virtual-tiles';



@Component({
  selector: 'page-applications',
  templateUrl: 'applications.html',
})
export class ApplicationsPage {
  private applications: Application[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private bleService: BleService,
              private devicesService: DevicesService,
              private mqttClient: MqttClient,
              private tilesApi: TilesApi,
              private storage: Storage) {}

  /**
   * Logout - empties the list of applications, changes the refreshstate
   * and presents login window.
   */
  public logout = () => {
    this.storage.set('loggedIn', false);
    this.applications = [];
    this.presentLoginModal();
  }

  /**
   * Called when the refresher is triggered by pulling down on the view of
   */
  public refreshApplications = (refresher: any): void => {
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
  public presentLoginModal = (): void => {
    const modal = this.modalCtrl.create(LoginPage);
    modal.onDidDismiss(data => this.setApplications());
    modal.present();
  }

  /**
   * Pushes the virtualTilesPage on viewStack and passes the pressed
   * application ID.
   * @param {Application} application - a tiles application fetched from the api
   */
  public viewApplication = (application: Application): void => {
    // Push another page onto the history stack
    // causing the nav controller to animate the new page in
    this.navCtrl.push(VirtualTilesPage, {
      app: application,
    });
  }

  /**
   * Called when the view is loaded to present login page if
   * the user is not logged in
   */
  public ionViewDidLoad = (): void => {
    this.storage.get('loginData').then(loginData => {
      if (loginData === null ||  loginData === undefined || loginData.remember === false) {
        this.presentLoginModal();
      } else {
        this.tilesApi.setLoginData(loginData);
        this.setApplications();
        this.mqttClient.connect();
      }
    });
  }

  /**
   * Called when the page has entered. Disconnects from connected devices
   * and clears the virtual device list of tilesApi
   */
  public ionViewDidEnter = () => {
    this.tilesApi.setActiveApp(null);
    this.tilesApi.clearVirtualTiles();
    for (let device of this.devicesService.getDevices()) {
      this.bleService.disconnect(device);
    }
  }

  /**
   * Set the list of applications from the api
   */
  private setApplications = (): void => {
    this.tilesApi.getAllApplications().then(data => this.applications = data)
                                      .catch(err => console.log(err));
  }
}
