import { inject, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TilesApi } from './tilesApi.service';
import { MqttClient } from './mqttClient';
import { BleService } from './ble.service';
import { StorageMock } from '../mocks';


import * as testDevice from '../fixtures/tilesDevice.json';

describe('mqttClient', () => {

  let mqttClient: MqttClient = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TilesApi,
        MqttClient,
        Events,
        {
          provide: Storage,
          useClass: StorageMock
        },
        MockBackend,
        BaseRequestOptions,
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
      expect(mqttClient.getDeviceSpecificTopic(testID, testEventBool)).toEqual('tiles/evt/TestUser/testEvent');
    });

    it('should return a correct url adress for the specific device when no event is passed as an argument', () => {
      let testID: string = 'testEvent';
      let testEventBool: boolean = false;
      expect(mqttClient.getDeviceSpecificTopic(testID, testEventBool)).toEqual('tiles/cmd/TestUser/testEvent');
    })
  });

  describe('setMqttConnectionStatus(connected: boolean): void', () => {
    it('should change connection based on the boolean argument given', () => {
      mqttClient.setMqttConnectionStatus(false);
      expect(mqttClient.connectedToBroker).toEqual(false);
      mqttClient.setMqttConnectionStatus(true);
      expect(mqttClient.connectedToBroker).toEqual(true);
    });
  });

  describe('connect(user: string, host: string, port: number): void', () => {
    /*it('should connect to the server and keep the connection alive afterwards until other commands are given', () => {
      let tUser: string = 'test1';
      let tHost: string = '127.0.0.0';
      let tPort: number = 8080;
      mqttClient.connect(tUser, tHost, tPort);
    });*/
  });

  describe('registerDevice(device: Device): void', () => {

  });

  describe('unregisterDevice(device: Device): void', () => {

  });

  describe('sendEvent(deviceId: string, event: CommandObject): void', () => {

  });

  describe('endConnection(deviceId: string, event: any): void', () => {

  });

});
