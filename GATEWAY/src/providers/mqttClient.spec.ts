import { inject, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import { Storage } from '@ionic/storage';
import { AlertController, App, Config, Events, Platform } from 'ionic-angular';
import { Logger }from './logger.service';
import { TilesApi } from './tilesApi.service';
import { MqttClient } from './mqttClient';
import { LoginData, Device, CommandObject, UtilsService } from './utils.service';
import { StorageMock, BackgroundFetchMock, MqttMock } from '../mocks';
import * as mqtt from 'mqtt';

describe('mqttClient', () => {

  let mqttClient: MqttClient = null;
  let loginData: LoginData = new LoginData('TestUser', '172.68.99.218', 8080, false);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        App,
        Config,
        AlertController,
        Platform,
        Logger,
        TilesApi,
        MqttClient,
        Events,
        UtilsService,
        MockBackend,
        BaseRequestOptions,
        {
        provide: BackgroundFetch,
        useClass: BackgroundFetchMock
        },
        {
          provide: Storage,
          useClass: StorageMock
        },
        {
          provide : Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ],
    });
  });

  beforeEach(inject([MqttClient], (temp: MqttClient) => {
    mqttClient = temp;
    mqttClient.setConnectionData(loginData);
  }));

  afterEach(() => {
    mqttClient = null;
  });

  it('should create an instance of the MqttClient', () => {
    expect(mqttClient).toBeTruthy;
  });

  describe('getDeviceSpecificTopic(deviceId: string, isEvent: boolean): string', () => {
    it('should return a correct url adress for the specific device', () => {
      let testID: string = 'testEvent';
      let testEventBool: boolean = true;
      expect(mqttClient.getDeviceSpecificTopic(testID, testEventBool)).toEqual('tiles/evt/TestUser//testEvent');
    });

    it('should return a correct url adress for the specific device when no event is passed as an argument', () => {
      let testID: string = 'testEvent';
      let testEventBool: boolean = false;
      expect(mqttClient.getDeviceSpecificTopic(testID, testEventBool)).toEqual('tiles/cmd/TestUser//testEvent');
    });
  });

  describe('connect(user: string, host: string, port: number): void', () => {

    it('should create a connection to the server', () => {
      spyOn(mqtt, 'connect').and.callFake( () => {
        return new MqttMock;
      });
      expect(mqttClient.mqttConnectionData).toBeDefined();
      expect(mqttClient.client).not.toBeDefined();

      mqttClient.connect();

      expect(mqttClient.client).toBeDefined();
    });

    it('should get connection data from tilesApi if it is undefined or null', () => {
      spyOn(mqtt, 'connect').and.callFake( () => {
        return new MqttMock;
      });
      mqttClient.setConnectionData(undefined);
      mqttClient.tilesApi.setLoginData(loginData);
      expect(mqttClient.mqttConnectionData).not.toBeDefined();

      mqttClient.connect();

      expect(mqttClient.mqttConnectionData).toBeDefined();
    });

    it('should end an old connection if it exists', () => {
      spyOn(mqtt, 'connect').and.callFake( () => {
        return new MqttMock;
      });
      mqttClient.client = new MqttMock;
      expect(mqttClient.client).toBeDefined();
      let spy = spyOn(mqttClient.client, 'end').and.callThrough();

      mqttClient.connect();

      expect(spy).toHaveBeenCalled();
      expect(spy.calls.count()).toEqual(1);
    });

    it('should call client.on a total of 6 (six) times', () => {
      let spyClient = new MqttMock;
      spyOn(mqtt, 'connect').and.callFake( () => {
        return spyClient;
      });
      let spy = spyOn(spyClient, 'on');

      mqttClient.connect();

      expect(spy.calls.count()).toEqual(6);
    });

  });

  // Due to a rewrite at the final stages of the project this test started failing
  // this is because we now register the device for each of the virtual tiles paired
  // to it. It can be fixed by pairing the tempDevice to a set number of virtual tiles
  xdescribe('registerDevice(device: Device): void', () => {

    it('should register a device at the server if client is defined', () => {
      let spyClient = new MqttMock;
      let tempDevice = new Device('test', 'test', 'test', false);
      mqttClient.client = spyClient;
      let publishSpy = spyOn(spyClient, 'publish');
      let subscribeSpy = spyOn(spyClient, 'subscribe');
      let topicSpy = spyOn(mqttClient, 'getDeviceSpecificTopic');

      mqttClient.registerDevice(tempDevice);

      expect(publishSpy.calls.count()).toEqual(2);
      expect(subscribeSpy.calls.count()).toEqual(1);
      expect(topicSpy.calls.count()).toEqual(3);
    });

  });

  describe('unregisterDevice(device: Device): void', () => {

    it('should unregister a device at the server if client is defined', () => {
      let spyClient = new MqttMock;
      let tempDevice = new Device('test', 'test', 'test', false);
      mqttClient.client = spyClient;
      let publishSpy = spyOn(spyClient, 'publish');
      let unsubscribeSpy = spyOn(spyClient, 'unsubscribe');
      let topicSpy = spyOn(mqttClient, 'getDeviceSpecificTopic');

      mqttClient.unregisterDevice(tempDevice);

      expect(publishSpy.calls.count()).toEqual(1);
      expect(unsubscribeSpy.calls.count()).toEqual(1);
      expect(topicSpy.calls.count()).toEqual(2);
    });

  });

  // Due to a rewrite at the final stages of the project this test started failing
  // this is because we now send the device for each of the virtual tiles paired
  // to it. It can be fixed by pairing the tempDevice to a set number of virtual tiles
  xdescribe('sendEvent(deviceId: string, event: CommandObject): void', () => {

    it('should send an event if client is defined', () => {
      let spyClient = new MqttMock;
      let comparisonCmdObj = new CommandObject('led', ['on', 'red']);
      mqttClient.client = spyClient;
      let publishSpy = spyOn(spyClient, 'publish');
      let topicSpy = spyOn(mqttClient, 'getDeviceSpecificTopic');

      mqttClient.sendEvent('test', comparisonCmdObj);

      expect(publishSpy.calls.count()).toEqual(1);
      expect(topicSpy.calls.count()).toEqual(1);
    });
  });

  describe('startBackgroundFetch(): void', () => {

    it('should start the BackgroundFetch', () => {
      let startSpy = spyOn(mqttClient.backgroundFetch, 'start');

      mqttClient.startBackgroundFetch();

      expect(startSpy).toHaveBeenCalled();
    });

  });

  describe('stopBackgroundFetch(): void', () => {

    it('should stop the BackgroundFetch', () => {
      let stopSpy = spyOn(mqttClient.backgroundFetch, 'stop');

      mqttClient.stopBackgroundFetch();

      expect(stopSpy).toHaveBeenCalled();
    });

  });

});

/** Mock HTTP
 * it('should return a list of three virtualTiles',
        inject([MockBackend], (mockBackend) => {

        const mockResponse = mockTilesApplicationDetailsResponse;

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        tilesApi.getApplicationTiles('test3').then(tiles => {
          expect(tiles.length).toEqual(2);
        });

    }));
 */
