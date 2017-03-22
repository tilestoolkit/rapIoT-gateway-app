import { inject, TestBed } from '@angular/core/testing';
import { Http, Response, ResponseOptions, BaseRequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { MockBackend } from '@angular/http/testing';
import { Device } from './utils.service';
import { TilesApi } from './tilesApi.service';

describe('tilesAPI', () => {

  let tilesApi: TilesApi = null;

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
        Device,
        Storage,
        TilesApi,
      ],
    });
  });

  beforeEach(inject([TilesApi], (temp: TilesApi) => {
    tilesApi = temp;
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
        "name" : "TileTest"
      };
      expect(tilesApi.isTilesDevice(testDevice)).toBeTruthy;
    });

    it('should return false when given a invalid device-input', () => {
      let testDevice2 = {
        "name" : "NotATilehuehue"
      };
      expect(tilesApi.isTilesDevice(testDevice2)).toBeFalsy;
    });
  });

  describe('setUsername(username: string): void', () => {
    it('should set the username of the TilesApi to match input', () => {
      let newname = "Bobcat";
      tilesApi.setUsername(newname);
      expect(tilesApi.username).toEqual(newname);
    });
  });

  describe('setHostAddress(hostAddress: string): void', () => {
    it('should set the hostAddress of the TilesApi to match input', () => {
      let testhost = "128.0.0.0";
      tilesApi.setHostAddress(testhost);
      expect(tilesApi.hostAddress).toEqual("128.0.0.0");
    });
  });

  describe('setHostMqttPort(hostMqttPort: number): void', () => {
    it('should set the hostMqttPort of the TilesApi to match input', () => {
      let testmqqt: number = 8080;
      tilesApi.setHostMqttPort(testmqqt);
      expect(tilesApi.mqttPort).toEqual(8080);
    });
  });

  describe('getAllApplications(): Promise<any>', () => {
    it('should return all available applications registered for all users',
      inject([MockBackend], mockBackend => {

      const mockResponse = [{id: 211, name: 'testitest'}, { id: 321, name: 'test2'}];

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      tilesApi.getAllApplications().then(application => {
        expect(application.name).toEqual('testitest').then(application => {
          expect(application.name).toEqual('test2');
        });
      });
      });
    });
  });

  describe('getApplicationDetails(applicationId: string): Promise<any>', () => {

  });

  describe('getApplicationTiles(applicationId: string): Promise<any>', () => {
    it('should return an application',
        inject([MockBackend], (mockBackend) => {

        const mockResponse = {id: 0, name: 'test' };

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        tilesApi.getApplicationDetails("0").then(application => {
          expect(application.name).toEqual("test");
        });

    }));
  });

  describe('pairDeviceToVirtualTile(deviceId: string, virtualTileId: string, applicationId: string): void', () => {

  });
});
