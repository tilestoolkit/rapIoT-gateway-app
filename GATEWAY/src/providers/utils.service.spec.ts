import { inject, TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { UtilsService, CommandObject }from './utils.service';
import { StorageMock } from '../mocks';

describe('utilsService', () => {

  let utilsService: UtilsService = null;
  let comparisonCmdObj = new CommandObject('led', ['on', 'red']);
  let comparisonCmdObj2 = new CommandObject('light', ['on']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Events,
        {
          provide: Storage,
          useClass: StorageMock
        },
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
      comparisonArray[0] = 116; comparisonArray[1] = 101; comparisonArray[2] = 115; comparisonArray[3] = 116;
      let returnArray: Uint8Array = utilsService.convertStringtoBytes(stringParameter);
      expect(returnArray).toEqual(comparisonArray);
    });

    it('should return null if the method is not able to convert the string', () => {
      let returnArray: Uint8Array = utilsService.convertStringtoBytes(null);
      expect(returnArray).toBeNull;
    });
  });

  describe('getEventStringAsObject(eventString: string): CommandObject', () => {
    // E.g, ´led,on,red´
    it('should return an object conatining the eventName and the properties of the string parameter', () => {
      let eventString = 'led,on,red';
      let cmdObj = utilsService.getEventStringAsObject(eventString);
      expect(cmdObj).toEqual(comparisonCmdObj);
    });

    it('should return ´null´ if the string parameter does not contain any properties', () => {
      let cmdObj: CommandObject = utilsService.getEventStringAsObject('test');
      expect(cmdObj).toBeNull;
    });
  });

  describe('getCommandObjectAsString(cmdObj: CommandObject): string', () => {
    it('should return the CommandObjects contents as a string', () => {
      let testObj: CommandObject = comparisonCmdObj;
      expect(utilsService.getCommandObjectAsString(testObj)).toEqual('led,on,red');
    });
  });

  describe('verifyLoginCredentials(user: string, host: string, port: number): boolean', () => {
    it('should return true when passing correctly formated test-user parameters', () => {
      let username: string = 'testUser';
      let host: string = '178.62.99.218';
      let port: number = 8080;
      expect(utilsService.verifyLoginCredentials(username, host, port)).toBeTruthy;
    });

    it('should return false when passing incorrectly formated username parameters', () => {
      let username: string = '}][{€$£@}]';
      let host: string = '178.62.99.218';
      let port: number = 8080;
      expect(utilsService.verifyLoginCredentials(username, host, port)).toBeFalsy;
    });

    it('should return false when passing incorrectly formated host parameters', () => {
      let username: string = 'testUser';
      let host: string = '1.1.1.1';
      let port: number = 8080;
      expect(utilsService.verifyLoginCredentials(username, host, port)).toBeFalsy;
    });

  });

  describe('capitalize(str: string): void', () => {

    it('should return a capitalized string', () => {
      let testString = "test";

      let result = utilsService.capitalize(testString);

      expect(result).toEqual("Test");
    });
  });

});
