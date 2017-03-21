import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginInfo = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginForm(){

  }

}
