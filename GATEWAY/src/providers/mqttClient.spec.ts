import { inject, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TilesApi } from './tilesApi.service';
import { MqttClient } from './mqttClient';
import { StorageMock } from '../mocks';

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

  });

  describe('setMqttConnectionStatus(connected: boolean): void', () => {

  });

  describe('connect(user: string, host: string, port: number): void', () => {

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
