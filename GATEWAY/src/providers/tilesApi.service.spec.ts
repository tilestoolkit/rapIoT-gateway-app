import { inject, TestBed, async } from '@angular/core/testing';
import { Http, Response, ResponseOptions, BaseRequestOptions, RequestMethod } from '@angular/http';
import { Storage } from '@ionic/storage';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Application, Device, LoginData, VirtualTile } from './utils.service';
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
    tilesApi.setActiveApp(activeApp);
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
      spyOn(tilesApi.storage, 'get');
      expect(tilesApi.getLoginData()).toEqual(loginData);
      expect(tilesApi.storage.get.calls.any()).toEqual(false);
    });

    it('should get loginData from storage if loginData is undefined', (() => {
      spyOn(tilesApi, 'setLoginData');
      tilesApi.loginData = undefined;
      spyOn(tilesApi.getStorage(), 'get').and.callFake( () => {
        return {
          then: (callback) => {return callback(loginData);}
        };
      });
      expect(tilesApi.setLoginData.calls.any()).toEqual(false);

      let returnedLoginData = (): Promise<any> => { return new Promise( () => {
                                  let temp = tilesApi.getLoginData();
                                  return temp;
                              })};
      returnedLoginData().then( res => {
        expect(tilesApi).toBeDefined();
        expect(tilesApi.setLoginData.calls.any()).toEqual(true);
        expect(res).toEqual(loginData);
      });
    }));

    it('should get loginData from storage if loginData is null', (() => {
      spyOn(tilesApi, 'setLoginData');
      tilesApi.loginData = null;
      spyOn(tilesApi.getStorage(), 'get').and.callFake( () => {
        return {
          then: (callback) => {return callback(loginData);}
        };
      });
      expect(tilesApi.setLoginData.calls.any()).toEqual(false);

      let returnedLoginData = (): Promise<any> => { return new Promise( () => {
                                  let temp = tilesApi.getLoginData();
                                  return temp;
                              })};
      returnedLoginData().then( res => {
        expect(tilesApi.setLoginData.calls.any()).toEqual(true);
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
      spyOn(tilesApi.http, "get").and.callThrough();
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Error());
      });
      expect(tilesApi.flagCatch).toBeFalsy();

      let returnedApplications = (): Promise<any> => { return new Promise( () => {
                                  let temp = tilesApi.getAllApplications();
                                  return temp;
                              })};
      returnedApplications().then( res => {
        expect(tilesApi.http.get).toThrowError();
        expect(tilesApi.flagCatch).toBeTruthy();
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
        expect(application).toBeNull();
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

    it('should catch if there is an error',
    inject([MockBackend], mockBackend => {
      spyOn(tilesApi.http, "post").and.callThrough();
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Error());
      });
      expect(tilesApi.flagCatch).toBeFalsy();

      let returnedApplications = (): Promise<any> => { return new Promise( () => {
                                  let temp = tilesApi.pairDeviceToVirualTile('test', '58c120c5497df8602fedfbd3');
                                  return temp;
                              })};
      returnedApplications().then( res => {
        expect(tilesApi.http.post).toThrowError();
        expect(tilesApi.flagThen).toBeTruthy();
      });
    }));

  });
});
