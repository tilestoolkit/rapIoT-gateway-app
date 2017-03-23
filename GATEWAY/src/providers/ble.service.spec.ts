import { inject, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TilesApi } from './tilesApi.service';
import { MqttClient } from './mqttClient';
import { BleService } from './ble.service';
import { DevicesService }from './devices.service';
import { UtilsService }from './utils.service';
import { StorageMock } from '../mocks';

describe('bleService', () => {

  let bleService: BleService = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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
        DevicesService,
        UtilsService,
        TilesApi,
        MqttClient,
        BleService,
      ],
    });
  });

  beforeEach(inject([BleService], (temp: BleService) => {
    bleService = temp;
  }));

  afterEach(() => {
    bleService = null;
  });

  it('should create an instance of the BleService', () => {
    expect(bleService).toBeTruthy;
  });

  describe('scanForDevices(virtualTiles: VirtualTile[]): void', () => {

  });

  describe('scanBLE(virtualTiles: VirtualTile[]): void', () => {

  });

  describe('connect(device: Device): void', () => {

  });

  describe('startDeviceNotification(device: Device): void', () => {

  });

  describe('disconnect(device: Device): void', () => {

  });

  describe('sendData(device: Device, dataString: string): void', () => {

  });

});