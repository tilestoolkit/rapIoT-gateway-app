import { inject, TestBed } from '@angular/core/testing';
import { Http, Response, ResponseOptions, BaseRequestOptions, RequestMethod } from '@angular/http';
import { Storage } from '@ionic/storage';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Application, Device, LoginData } from './utils.service';
import { TilesApi } from './tilesApi.service';
import { StorageMock } from '../mocks';

import * as mockTilesApplicationDetailsResponse from '../fixtures/applicationDetails.json';
import * as mockTilesApplicationsResponse from '../fixtures/applications.json';

describe('tilesAPI', () => {

  let tilesApi: TilesApi = null;
  let loginData: LoginData = new LoginData('Test', '172.68.99.218', 8080, false);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide : Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
        {
          provide: Storage,
          useClass: StorageMock
        },
        TilesApi,
      ],
    });
  });

  beforeEach(inject([TilesApi], (temp: TilesApi) => {
    tilesApi = temp;
    tilesApi.setLoginData(loginData);
    tilesApi.setActiveApp(new Application('test3', '', '', false, false, 8080, []));
  }));

  afterEach(() => {
    tilesApi = null;
  });

  it('should create an instance of the TilesApi', () => {
    expect(tilesApi).toBeTruthy;
  });

  describe('isTilesDevice(device: any): boolean', () => {
    it('should return true when given a valid device-input', () => {
      const testDevice = new Device('xx', 'xx', 'TileTest', false);
      expect(tilesApi.isTilesDevice(testDevice)).toBeTruthy;
    });

    it('should return false when given a invalid device-input', () => {
      const testDevice2 = new Device('xx', 'xx', 'NotATile', false);
      expect(tilesApi.isTilesDevice(testDevice2)).toBeFalsy;
    });
  });

  describe('setLoginData(loginData: LoginData): void', () => {
    it('should set the correct login data in the beforeEach', () => {
      /**
       * tilesApi.loginData is set before each test
       * Therefore it is only necessary to test if the correct data
       * is set here
       */
      expect(tilesApi.getLoginData()).toEqual(loginData);
    });
  });

  describe('getLoginData(): void', () => {

    it('should return the correct login data', () => {
      expect(tilesApi.getLoginData()).toEqual(loginData);
      expect(tilesApi.flagThen).toBeFalsy();
    });

    it('should get loginData from storage if loginData is undefined', () => {
      tilesApi.setLoginData(undefined);
      spyOn(tilesApi.getStorage(), 'get').and.callFake( () => {
        return {
          then: (callback) => {return callback(loginData);}
        };
      });
      expect(tilesApi.flagThen).toBeFalsy();

      let returnedLoginData = tilesApi.getLoginData();
      
      setTimeout(() => {
        expect(tilesApi.flagThen).toBeTruthy();
        expect(returnedLoginData).toEqual(loginData);
      }, 0);
    });

    it('should get loginData from storage if loginData is null', () => {
      tilesApi.setLoginData(null);
      spyOn(tilesApi.getStorage(), 'get').and.callFake( () => {
        return {
          then: (callback) => {return callback(loginData);}
        };
      });
      expect(tilesApi.flagThen).toBeFalsy();

      let returnedLoginData = tilesApi.getLoginData();
      
      setTimeout(() => {
        expect(tilesApi.flagThen).toBeTruthy();
        expect(returnedLoginData).toEqual(loginData);
      }, 0);
    });

  });

  describe('setActiveApp(activeApp: Application): void', () => {

  });

  describe('getActiveApp(): Application', () => {

  });

  describe('setVirtualTiles(appId: string): void', () => {
    it('should set virtualTiles equal to a list of virtual tiles from an application', () => {
      spyOn(tilesApi, 'getApplicationTiles').and.callFake( () => {
        return {
          then: (callback) => {return callback(mockTilesApplicationDetailsResponse.virtualTiles);}
        };
      });
      
      tilesApi.setVirtualTiles();

      expect(tilesApi['getApplicationTiles']).toHaveBeenCalled();
      expect(tilesApi.getVirtualTiles()).toEqual(mockTilesApplicationDetailsResponse.virtualTiles);
    })
  });

  describe('getAllApplications(): Promise<any>', () => {
    it('should return all available applications registered for all users',
      inject([MockBackend], mockBackend => {

      const mockResponse = mockTilesApplicationsResponse;

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      tilesApi.getAllApplications().then(applications => {
        expect(applications.length).toEqual(3);
        expect(applications[2]._id).toEqual('asd');
      });
    }));
  });

  describe('getApplicationDetails(applicationId: string): Promise<any>', () => {
    it('should return an application named "test3"',
        inject([MockBackend], (mockBackend) => {

        const mockResponse = mockTilesApplicationDetailsResponse;

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        tilesApi.getApplicationDetails().then(application => {
          expect(application._id).toEqual('test3');
        });

    }));
  });

  describe('getApplicationTiles(applicationId: string): Promise<any>', () => {
    it('should return a list of three virtualTiles',
        inject([MockBackend], (mockBackend) => {

        const mockResponse = mockTilesApplicationDetailsResponse;

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        tilesApi.getApplicationTiles().then(tiles => {
          expect(tiles.length).toEqual(2);
        });

    }));
  });

  describe('pairDeviceToVirtualTile(deviceId: string, virtualTileId: string, applicationId: string): void', () => {
    it('should pair a device to a virtual tile and return status code 201', inject([MockBackend], (mockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        // is it the correct REST type for an insert? (POST)
        expect(connection.request.method).toBe(RequestMethod.Post);

        connection.mockRespond(new Response(new ResponseOptions({status: 201})));
      });

      tilesApi.pairDeviceToVirualTile('test', '58c120c5497df8602fedfbd3').then(
        (successResult) => {
          expect(successResult).toBeDefined();
          expect(successResult.status).toBe(201);
        });
    }));
  });
});
