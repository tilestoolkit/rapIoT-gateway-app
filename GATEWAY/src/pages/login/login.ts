import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MqttClient } from '../../providers/mqttClient';
import { TilesApi } from '../../providers/tilesApi.service';
import { UtilsService } from '../../providers/utils.service';


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
  loginInfo = {};

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private mqttClient: MqttClient,
      private tilesApi: TilesApi,
      private  utils: UtilsService,)
  {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginForm(){

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
