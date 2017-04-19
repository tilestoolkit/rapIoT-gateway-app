import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ViewController, AlertController } from 'ionic-angular';

import { TilesApi } from '../../providers/tilesApi.service';
import { MqttClient } from '../../providers/mqttClient';
import { LoginData, UtilsService } from '../../providers/utils.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginInfo = { user: '', host: '', port: '', remember: false };

  constructor(public viewCtrl: ViewController,
              private tilesApi: TilesApi,
              private mqttClient: MqttClient,
              private utils: UtilsService,
              private storage: Storage,
              private alertCtrl: AlertController) {}

  /**
   * Connect to the mqttServer
   * @param {string} user - username
   * @param {string} host - api host address
   * @param {number} port - mqtt port number
   */
  connectToServer = (user: string, host: string, port: number, remember: boolean): void => {
    if (this.utils.verifyLoginCredentials(user, host, port)) {
      this.tilesApi.getAllUsers(user, host).then(data => {
        if (data) {
          const loginData = new LoginData(user, host, port, remember);
          this.storage.set('loginData', loginData).then(res => {
            this.tilesApi.setLoginData(loginData);
            this.mqttClient.connect();
          });
          this.storage.set('loggedIn', loginData.remember);
          this.viewCtrl.dismiss('logged_in');
        } else {
          this.alertCtrl.create({
            title: 'Invalid login credentials',
            subTitle: 'Please try again.',
            buttons: [{
              text: 'Dismiss',
            }]
          }).present();
        }
      });
    }
  }

  /**
   * Passes the login credidentials from the login form to the connectToServer function.
   */
  loginForm = (): void => {
    this.connectToServer(this.loginInfo.user, this.loginInfo.host, parseInt(this.loginInfo.port, 10), this.loginInfo.remember);
  }

  /**
   * Login with these fixed values.
   */
  // autoLogin() {
  //   this.connectToServer('Testuser', '178.62.99.218', 3000, true);
  // }
}
