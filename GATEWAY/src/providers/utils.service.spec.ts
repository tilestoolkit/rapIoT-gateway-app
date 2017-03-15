import { inject, TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { UtilsService }from './utils.service';

describe('utilsService', () => {

  let utilsService: UtilsService = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Events,
        Storage,
        UtilsService,
      ],
    });
  });

  beforeEach( inject([UtilsService], (temp: UtilsService) => {
    utilsService = temp;
  }));

  it('should create an instance of the UtilsService', () => {
    expect(utilsService).toBeTruthy;
  });

});