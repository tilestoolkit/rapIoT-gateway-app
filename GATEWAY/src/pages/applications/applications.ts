import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ModalPage } from './modal-page';
import { LoginPage } from '../login/login';
import { VirtualTilesPage } from '../virtual-tiles/virtual-tiles';

import { TilesApi } from '../../providers/tilesApi.service';
import { Application, UtilsService } from '../../providers/utils.service';
import { MqttClient } from '../../providers/mqttClient';

import { Storage } from '@ionic/storage';
/*
  Generated class for the Applications page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-applications',
  templateUrl: 'applications.html',
})
export class ApplicationsPage {
  applications: Application[];
  public refreshed = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private mqttClient: MqttClient,
              private tilesApi: TilesApi,
              private utils: UtilsService,
              private storage: Storage,) {}
  /**
   * Called when the view is loaded to present login page if 
   * the user is not logged in
   */
  ionViewDidLoad() {
    this.storage.get('loggedIn').then((val) => {
      if (val == null || val == false) {
        this.presentLoginModal();
      } else {
        this.storage.get('loginData').then((loginData) => {
          this.tilesApi.setLoginData(loginData);
          this.mqttClient.connect();
          this.setApplications();
        });
      }
    });
  }

  /**
   * Set the list of applications from the api
   */
  setApplications = (): void => {
    this.tilesApi.getAllApplications().then( data => {
      this.refreshed = false;
      this.applications = data;
    }).catch (err => console.log(err));
  }

  /**
   * Called when the refresher is triggered by pulling down on the view of
   */
  refreshApplications = (refresher): void => {
    this.setApplications();
    //Makes the refresher run for 2 secs
    setTimeout(() => {
      refresher.complete();
    }, 1250);
  }

  /**
   *  Pushes the modal on the viewStack.
   */
  presentLoginModal() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.onDidDismiss(data => {
        this.setApplications();
   });
   modal.present();
  }

  /**
   * Logout - empties the list of applications, changes the refreshstate 
   * and presents login window.
   */
  logout = () => {
    this.storage.set('loggedIn', false);
    this.applications = [];
    this.refreshed = true;
    this.presentLoginModal();
  }

  /**
   * Pushes the virtualTilesPage on viewStack and passes the pressed
   * application ID.
   * @param {Application} application - a tiles application created in the web view
   */
  viewApplication = (application: Application): void => {
    // Push another page onto the history stack
    // causing the nav controller to animate the new page in
    this.navCtrl.push(VirtualTilesPage, {
    	app: application,
    });
  }
}
