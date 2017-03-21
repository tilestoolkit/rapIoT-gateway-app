import { Component } from '@angular/core';
import { LoginPage } from '../login/login';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  public rootPage: any = LoginPage;

  constructor() {

  }
}

export default { TabsPage }
