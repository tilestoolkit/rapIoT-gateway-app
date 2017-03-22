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

  afterEach(() => {
    utilsService = null;
  });

  it('should create an instance of the UtilsService', () => {
    expect(utilsService).toBeTruthy;
  });

  describe('convertStringToBytes(str: String): any', () => {
    it('should convert the string parameter to an array og bytes', () => {
      let stringParameter = 'test';
      let comparisonArray = new Uint8Array(4);
      comparisonArray[0] = 116;comparisonArray[1] = 101;comparisonArray[2] = 115;comparisonArray[3] = 116;
      let returnArray: Uint8Array = utilsService.convertStringtoBytes(stringParameter);
      expect(returnArray).toEqual(comparisonArray);
    });
  });

  describe('getEventStringAsObject(eventString: string): CommandObject', () => {

  });

  describe('getCommandObjectAsString(cmdObj: CommandObject): string', () => {

  });

  describe('extendObject(obj1: any, obj2: any): any', () => {

  });

  describe('verifyLoginCredentials(user: string, host: string, port: number): boolean', () => {
    it('should return true when passing the test-user parameters', () => {
      let username: string = 'testuser';
      let host: string = 'testhost';
      let port: number = 8080;
      expect(utilsService.verifyLoginCredentials(username, host, port)).toBeTruthy;
    });
    it('should return false when passing the test-user parameters', () => {
      let username: string = 'testuser';
      let host: string = '99999testhost999999999999999';
      let port: number = 8080;
      expect(utilsService.verifyLoginCredentialsusername, host, port)).toBeFalsy;
    });
  });

});
