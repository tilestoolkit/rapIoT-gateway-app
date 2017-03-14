import { inject, TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { Device, DevicesService }from './devices.service';

describe('devicesService', () => {

  let devicesService: DevicesService = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Events,
        Storage,
        DevicesService
      ]
    });
  });

  it('should make an instance of the DevicesService', inject([DevicesService], (temp: DevicesService) => {
    devicesService = temp;
    expect(devicesService).toBeTruthy;
  }));

});