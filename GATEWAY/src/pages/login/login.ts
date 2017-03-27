import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ViewController } from 'ionic-angular';

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
              private storage: Storage){}

  /**
   * Connect to the mqttServer
   * @param {string} user - username
   * @param {string} host - api host address
   * @param {number} port - mqtt port number
   */
  connectToServer = (user: string, host: string, port: number, remember: boolean): void => {
    if (this.utils.verifyLoginCredentials(user, host, port)) {
      const loginData = new LoginData(user, host, port, remember);
      this.storage.set('loginData', loginData).then(res => {
        this.tilesApi.setLoginData(loginData);
        this.mqttClient.connect();
      });
      this.storage.set('loggedIn', loginData.remember);
      this.viewCtrl.dismiss('logged_in');
    } else {
      alert("Invalid login credentials.");
    }
  }

  /**
   * Passes the login credidentials from the login form to the connectToServer function.
   */
  loginForm() {
    this.connectToServer(this.loginInfo.user, this.loginInfo.host, parseInt(this.loginInfo.port), this.loginInfo.remember);
  }

  autoLogin() {
    this.connectToServer('Andrea', '178.62.99.218', 8080, true);
  }
}
