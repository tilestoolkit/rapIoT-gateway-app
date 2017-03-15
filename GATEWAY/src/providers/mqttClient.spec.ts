import { inject, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TilesApi } from './tilesApi.service';
import { MqttClient } from './mqttClient';
import { BleService } from './ble.service';

describe('mqttClient', () => {

  let mqttClient: MqttClient = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TilesApi,
        MqttClient,
        Events,
        Storage,
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

  it('should create an instance of the MqttClient', () => {
    expect(mqttClient).toBeTruthy;
  });

});