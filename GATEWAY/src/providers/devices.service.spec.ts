import { inject, TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { DevicesService }from './devices.service';

describe('devicesService', () => {

  let devicesService: DevicesService = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Events,
        Storage,
        DevicesService,
      ],
    });
  });

  beforeEach( inject([DevicesService], (temp: DevicesService) => {
    devicesService = temp;
  }));

  afterEach(() => {
    devicesService = null;
  });

  it('should create an instance of the DevicesService', () => {
    expect(devicesService).toBeTruthy;
  });

});