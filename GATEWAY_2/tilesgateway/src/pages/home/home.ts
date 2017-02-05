import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Device, DevicesService } from '../../providers/devices.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	devices: Device[];

  constructor(public navCtrl: NavController, 
  						private devicesService: DevicesService) {
  	this.devices = devicesService.getMockDevices();
  };

};
