import { inject, TestBed, async } from '@angular/core/testing';
import { Http, Response, ResponseOptions, BaseRequestOptions, RequestMethod } from '@angular/http';
import { Storage } from '@ionic/storage';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Application, Device, LoginData, VirtualTile } from './utils.service';
import { App, Config, AlertController, Platform } from 'ionic-angular';
import { TilesApi } from './tilesApi.service';
import { StorageMock } from '../mocks';

import * as mockTilesApplicationDetailsResponse from '../fixtures/applicationDetails.json';
import * as mockTilesApplicationsResponse from '../fixtures/applications.json';
import * as mockUsersResponse from '../fixtures/users.json';

describe('tilesAPI', () => {

  let tilesApi: TilesApi = null;
  let loginData: LoginData = new LoginData('Test', '172.68.99.218', 8080, false);
  let activeApp: Application = new Application('test3', '', '', false, false, 8080, []);
  let virtualTile: VirtualTile = new VirtualTile();
  let spyError: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        App,
        Config,
        AlertController,
        MockBackend,
        BaseRequestOptions,
        Platform,
        TilesApi,
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
      ],
    });
  });

  beforeEach(inject([TilesApi], (temp: TilesApi) => {
    tilesApi = temp;
    tilesApi.loginData = loginData;
    tilesApi.activeApp = activeApp;
    spyError = spyOn(tilesApi.errorAlert, "present");
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
      tilesApi.setLoginData(loginData);

      expect(tilesApi.loginData).toEqual(loginData);
    });
  });

  describe('getLoginData(): void', () => {

    it('should return the correct login data', () => {
      let spy = spyOn(tilesApi.storage, 'get').and.callThrough();
      expect(tilesApi.getLoginData()).toEqual(loginData);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should get loginData from storage if loginData is undefined', (() => {
      let spy = spyOn(tilesApi, 'setLoginData').and.callThrough();
      tilesApi.loginData = undefined;
      spyOn(tilesApi.storage, 'get').and.callFake( () => {
        return {
          then: (callback) => {return callback(loginData);}
        };
      });

      let returnedLoginData = (): Promise<any> => { return new Promise( () => {
                                  return tilesApi.getLoginData();
                              })};
      returnedLoginData().then( res => {
        expect(tilesApi).toBeDefined();
        expect(spy).toHaveBeenCalled();
        expect(res).toEqual(loginData);
      });
    }));

    it('should get loginData from storage if loginData is null', (() => {
      let spy = spyOn(tilesApi, 'setLoginData').and.callThrough();
      tilesApi.loginData = null;
      spyOn(tilesApi.storage, 'get').and.callFake( () => {
        return {
          then: (callback) => {return callback(loginData);}
        };
      });

      let returnedLoginData = (): Promise<any> => { return new Promise( () => {
                                  return tilesApi.getLoginData();
                              })};
      returnedLoginData().then( res => {
        expect(spy).toHaveBeenCalled();
        expect(res).toEqual(loginData);
      });
    }));

  });

  describe('setActiveApp(activeApp: Application): void', () => {

    it('should set the activeApp equal to the parameter', () => {
      tilesApi.activeApp = undefined;
      expect(tilesApi.activeApp).toBeUndefined();

      tilesApi.setActiveApp(activeApp);

      expect(tilesApi.activeApp).toEqual(activeApp);
    });

  });

  describe('getActiveApp(): Application', () => {

    it('should return the active app', () => {
      //Active app is set beforeEach, so here it is only necessary to test the return value
      let returnedApp = tilesApi.getActiveApp();

      expect(returnedApp).toEqual(activeApp);
    });

    it('should return a mock application if activeApp is undefined', () => {
      //The mock application returned is the same as 'activeApp'
      tilesApi.activeApp = undefined;
      expect(tilesApi.activeApp).toBeUndefined();

      let returnedApp = tilesApi.getActiveApp();

      expect(returnedApp).toEqual(activeApp);
    });

  });

  describe('setVirtualTiles(appId: string): void', () => {
    it('should set virtualTiles equal to a list of Virtual Tiles from an application', () => {
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

  describe('getVirtualTiles(): VirtualTile[]', () => {

    it('should return a list of the Virtual Tiles', () => {
      tilesApi.virtualTiles = [virtualTile];

      let returnedVirtualTiles = tilesApi.getVirtualTiles();

      expect(returnedVirtualTiles.length).toEqual(1);
      expect(returnedVirtualTiles[0]).toEqual(virtualTile);
    });

  });

  describe('clearVirtualTiles(): void', () => {

    it('should clear the list of Virtual Tiles', () => {
      tilesApi.virtualTiles = [virtualTile];

      tilesApi.clearVirtualTiles();

      expect(tilesApi.virtualTiles.length).toEqual(0);
      expect(tilesApi.virtualTiles[0]).toBeUndefined();
    });

  });

  describe('isTilesUser(userName: string, host: string): Promise<any>', () => {

    it('should return true if the userName is registered in the server',
    inject([MockBackend], mockBackend => {

      const mockResponse = mockUsersResponse;

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      tilesApi.isTilesUser("TestUser", "1.1.1.1").then(registered => {
        expect(registered).toBeTruthy();
      });
    }));

    it('should return false if the userName is not registered in the server',
    inject([MockBackend], mockBackend => {

      const mockResponse = mockUsersResponse;

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      tilesApi.isTilesUser("notRegistered", "1.1.1.1").then(registered => {
        expect(registered).toBeFalsy();
      });
    }));

    it('should return false if there is an error',
    inject([MockBackend], mockBackend => {

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Error());
      });

      tilesApi.isTilesUser("TestUser", "1.1.1.1").then(registered => {
        expect(registered).toBeFalsy();
      });
    }));

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

    it('should catch if there is an error',
    inject([MockBackend], mockBackend => {
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Error());
      });

      let returnedApplications = (): Promise<any> => { return new Promise( () => {
                                  let temp = tilesApi.getAllApplications();
                                  return temp;
                              })};
      returnedApplications().then( res => {
        expect(tilesApi.http.get).toThrowError();
        expect(res).toEqual(null);
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

    it('should return null if there is an error',
    inject([MockBackend], mockBackend => {
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Error());
      });

      tilesApi.getApplicationDetails().then(application => {
        expect(application).toBeUndefined();
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
    it('should pair a device to a virtual tile and return status code 201',
      inject([MockBackend], (mockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Post);
        connection.mockRespond(new Response(new ResponseOptions({status: 201})));
      });
      let returnedStatuscode = (): Promise<any> => { return new Promise( () => {
                                  let temp = tilesApi.pairDeviceToVirualTile('test', '58c120c5497df8602fedfbd3');
                                  return temp;
                              })};
      returnedStatuscode().then( successResult => {
        expect(successResult).toBeDefined();
        expect(successResult.status).toBe(201);
      });
    }));

    it('should catch if there is an error',
      inject([MockBackend], mockBackend => {

      spyOn(tilesApi.http, "post").and.callThrough();
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Error());
      });

      let returnedStatuscode = (): Promise<any> => { return new Promise( () => {
                                  let temp = tilesApi.pairDeviceToVirualTile('test', '58c120c5497df8602fedfbd3');
                                  return temp;
                              })};
      returnedStatuscode().then( res => {
        expect(tilesApi.http.post).toThrowError();
        expect(res).toBeNull();
      });
    }));

  });

  describe('addTileToDatabase(DeviceId: string): Promise<boolean>', () => {

    it('should return true if the tile gets added to the database',
      inject([MockBackend], (mockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Post);
        connection.mockRespond(new Response(new ResponseOptions({status: 201})));
      });

      tilesApi.addTileToDatabase("test").then( res => {
        expect(res).toBeTruthy();
      });
    }));

    it('should return false if the method throws an error',
      inject([MockBackend], (mockBackend) => {

      spyOn(tilesApi.http, "post").and.callThrough();
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Error("Test"));
      });

      tilesApi.addTileToDatabase("test").catch(err => {
        expect(tilesApi.http.post).toThrowError();
        expect(err).toBeFalsy();
      });

    }));

  });
});
