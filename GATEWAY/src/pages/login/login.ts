import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { TilesApi } from '../../providers/tilesApi.service';
import { Application, UtilsService } from '../../providers/utils.service';
import { MqttClient } from '../../providers/mqttClient';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
    providers: [
        TilesApi,
        MqttClient,
        UtilsService,
    ],
})
export class LoginPage {
  loginInfo = {username: '', host: '', port: ''};
  remember = false;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private mqttClient: MqttClient,
      private tilesApi: TilesApi,
      private  utils: UtilsService,
      private storage: Storage,
      public modalCtrl: ModalController)
  {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  connectToServer = (user: string, host: string, port: number): void => {
    if (this.utils.verifyLoginCredentials(user, host, port)) {
      this.mqttClient.connect(user, host, port);
      localStorage.setItem('user', user);
      this.storage.set('loggedIn', this.remember);
      this.navCtrl.pop();
    } else {
      alert("Invalid login credentials.");
    }
  }

  rememberMe() {
    this.remember = !this.remember;
  }

  loginForm() {
    this.connectToServer(this.loginInfo.username, this.loginInfo.host, parseInt(this.loginInfo.port));
  }

    /*
    connectToServer = (user: string, host: string, port: number): void => {
        if (this.verifyLoginCredentials(user, host, port)) {
            this.mqttClient.connect(user, host, port);
        } else {
            alert("Invalid login credentials.");
        }
    }
    */

}
