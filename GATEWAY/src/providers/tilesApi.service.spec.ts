import { inject, TestBed } from '@angular/core/testing';
import { Http, Response, ResponseOptions, BaseRequestOptions, RequestMethod } from '@angular/http';
import { Storage } from '@ionic/storage';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Device, LoginData } from './utils.service';
import { TilesApi } from './tilesApi.service';
import { StorageMock } from '../mocks';

import * as mockTilesApplicationDetailsResponse from '../fixtures/applicationDetails.json';
import * as mockTilesApplicationsResponse from '../fixtures/applications.json';

describe('tilesAPI', () => {

  let tilesApi: TilesApi = null;
  let loginData: LoginData = new LoginData("Test", "172.68.99.218", 8080, false);

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
        Device,
        TilesApi,
      ],
    });
  });

  beforeEach(inject([TilesApi], (temp: TilesApi) => {
    tilesApi = temp;
    tilesApi.setLoginData(loginData);
  }));

  afterEach(() => {
    tilesApi = null;
  });

  it('should create an instance of the TilesApi', () => {
    expect(tilesApi).toBeTruthy;
  });

  describe('isTilesDevice(device: any): boolean', () => {
    it('should return true when given a valid device-input', () => {
      let testDevice = {
        'name' : 'TileTest'
      };
      expect(tilesApi.isTilesDevice(testDevice)).toBeTruthy;
    });

    it('should return false when given a invalid device-input', () => {
      let testDevice2 = {
        'name' : 'NotATilehuehue'
      };
      expect(tilesApi.isTilesDevice(testDevice2)).toBeFalsy;
    });
  });

  xdescribe('setUsername(username: string): void', () => {
    it('should set the username of the TilesApi to match input', () => {
      let newname = 'Bobcat';
      tilesApi.setUsername(newname);
      expect(tilesApi.username).toEqual(newname);
    });
  });

  xdescribe('setHostAddress(hostAddress: string): void', () => {
    it('should set the hostAddress of the TilesApi to match input', () => {
      let testhost = '128.0.0.0';
      tilesApi.setHostAddress(testhost);
      expect(tilesApi.hostAddress).toEqual('128.0.0.0');
    });
  });

  xdescribe('setHostMqttPort(hostMqttPort: number): void', () => {
    it('should set the hostMqttPort of the TilesApi to match input', () => {
      let testmqqt: number = 8080;
      tilesApi.setHostMqttPort(testmqqt);
      expect(tilesApi.mqttPort).toEqual(8080);
    });
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

        tilesApi.getApplicationDetails('test3').then(application => {
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

        tilesApi.getApplicationTiles('test3').then(tiles => {
          expect(tiles.length).toEqual(3);
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

      tilesApi.pairDeviceToVirualTile('test', '58c120c5497df8602fedfbd3', 'test3').then(
        (successResult) => {
          expect(successResult).toBeDefined();
          expect(successResult.status).toBe(201);
        });
    }));
  });
});
