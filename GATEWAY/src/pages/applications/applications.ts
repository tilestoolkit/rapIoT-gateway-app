import { Component, Injectable } from '@angular/core';
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
  providers: [TilesApi]
})

@Injectable()
export class ApplicationsPage {
  applications: Application[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private mqttClient: MqttClient,
              private tilesApi: TilesApi,
              private utils: UtilsService,
              private storage: Storage) {}

  ionViewDidLoad() {
    this.storage.get('loggedIn').then((val) => {
      console.log(val);
      if (val == null || val == false) {
        this.presentModal();
      }
    });
  }

  setApplications = (): void => {
    this.tilesApi.getAllApplications().then( data => {
      this.applications = data;
    }).catch (err => console.log(err));
  }

  refreshApplications = (refresher): void => {
    console.log('Scanning for more devices...');
    this.setApplications();
    //Makes the refresher run for 2 secs
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  presentModal() {
    console.log("presentModal")
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }



	// showConnectMQTTPopup = () => {
	// 	this.connectToServer('andrea', '172.68.99.218', parseInt('8080'));
	// };


  escape = () => {
    this.storage.set('loggedIn', false);
    this.presentModal();
  }


  viewApplication = (application: Application): void => {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(VirtualTilesPage, {
    	_id: application._id
    });
  }
}
