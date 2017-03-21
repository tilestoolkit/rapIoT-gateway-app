import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ModalPage } from './modal-page';
import { LoginPage } from '../login/login';

import { VirtualTilesPage } from '../virtual-tiles/virtual-tiles';

/*
  Generated class for the Applications page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-applications',
  templateUrl: 'applications.html'
})
export class ApplicationsPage {
  loggedIn = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {}

  ionViewDidLoad() {
    console.log("applications loaded")
    if(!this.loggedIn){
      this.presentModal();
    }
  }

  presentModal() {
    console.log("presentModal")
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }

  goToApplicationView() {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(VirtualTilesPage);
  }
}

