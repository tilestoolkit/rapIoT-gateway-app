import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ModalPage } from './modal-page';
import { LoginPage } from '../login/login';
import { VirtualTilesPage } from '../virtual-tiles/virtual-tiles';

import { TilesApi } from '../../providers/tilesApi.service';
import { Application, UtilsService } from '../../providers/utils.service';
import { MqttClient } from '../../providers/mqttClient';

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
export class ApplicationsPage {
  loggedIn = true;
  applications: Application[];

  constructor(public navCtrl: NavController, 
  						public navParams: NavParams, 
  						public modalCtrl: ModalController,
  						public alertCtrl: AlertController,
  						private mqttClient: MqttClient,
  						private tilesApi: TilesApi,
  						private utils: UtilsService) {}

  ionViewDidLoad() {
    console.log("applications loaded");

    if(!this.loggedIn){
      this.presentModal();
    }
  }

  presentModal() {
    console.log("presentModal")
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }


  setApplications = (): void => {
    this.tilesApi.getAllApplications().then( data => {
       this.applications = data;
      console.log('DATA: ' + data);
    }).catch (err => console.log(err));
  }

  connectToServer = (user: string, host: string, port: number): void => {
		if (this.utils.verifyLoginCredentials(user, host, port)) {
			this.mqttClient.connect(user, host, port);
		} else {
			alert("Invalid login credentials.");
		}
	}

	showConnectMQTTPopup = () => {
		this.connectToServer('andrea', '172.68.99.218', parseInt('8080'));
    this.setApplications();
	};



  viewApplication = (application: Application): void => {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(VirtualTilesPage, {
    	_id: application._id
    });
  }
}
