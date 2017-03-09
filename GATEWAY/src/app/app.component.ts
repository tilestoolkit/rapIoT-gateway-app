import { Component, Injectable, Inject } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AppVersion, StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';

//TODO: Update this to match the app.js from the old version
@Component({
  templateUrl: 'app.html'
})  
export class Tiles {
  rootPage = TabsPage;
  /*
  appVersion: any;
  applications: Object[];
  */
  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      /*
      this.applications = [{"title":"test"}, {"title":"test2"}];
      this.appVersion = JSON.stringify(AppVersion.getVersionNumber().then(res => res.json()));
      */
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
