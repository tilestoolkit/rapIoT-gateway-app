import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';

import { UtilsService } from '../../providers/utils.service';
import { MqttClient } from '../../providers/mqttClient';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginInfo = {username: '', host: '', port: '', remember: false};

  constructor(
      public navCtrl: NavController,
      private mqttClient: MqttClient,
      private  utils: UtilsService,
      private storage: Storage,){}

  /**
   * Connect to the mqttServer
   * @param {string} user - username
   * @param {string} host - api host address
   * @param {number} port - mqtt port number
   */
  connectToServer = (user: string, host: string, port: number): void => {
    if (this.utils.verifyLoginCredentials(user, host, port)) {
      this.mqttClient.connect(user, host, port);
      localStorage.setItem('user', user);
      this.storage.set('loggedIn', this.loginInfo.remember);
      this.navCtrl.pop();
    } else {
      alert("Invalid login credentials.");
    }
  }

  /**
   * Passes the login credidentials from the login form to the connectToServer function.
   */
  loginForm() {
    this.connectToServer(this.loginInfo.username, this.loginInfo.host, parseInt(this.loginInfo.port));
  }

  autoLogin() {
    this.connectToServer('andrea', '178.62.99.218', parseInt('8080'));
  }
}
