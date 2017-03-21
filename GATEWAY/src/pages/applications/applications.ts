import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplicationsPage');
  }

  goToApplicationView() {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(VirtualTilesPage);
  }
}

