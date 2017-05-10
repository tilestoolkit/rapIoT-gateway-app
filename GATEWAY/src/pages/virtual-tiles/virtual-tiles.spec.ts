import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
import { Component, forwardRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BLE } from '@ionic-native/ble';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import { Diagnostic } from '@ionic-native/diagnostic';
import { BackgroundMode } from '@ionic-native/background-mode';
import { IonicModule, AlertController, Events, NavController, NavParams } from 'ionic-angular';
import { Tiles } from '../../app/app.component';
import { NavParamsMock, NavMock, StorageMock, BackgroundFetchMock } from "../../mocks";
import { BleService } from '../../providers/ble.service';
import { DevicesService } from '../../providers/devices.service';
import { TilesApi } from '../../providers/tilesApi.service';
import { MqttClient } from '../../providers/mqttClient';
import { Application, LoginData, VirtualTile, UtilsService } from '../../providers/utils.service';
import { VirtualTilesPage } from "../../pages/virtual-tiles/virtual-tiles";

import { App, Config, Platform } from 'ionic-angular';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, ResponseOptions, BaseRequestOptions, RequestMethod } from '@angular/http';

let virtualTiles: VirtualTilesPage;
let fixture: ComponentFixture<VirtualTilesPage>;
let spyError: jasmine.Spy;

describe('virtual-tiles', () => {
  let tilesApi: TilesApi = null;
  let loginData: LoginData = new LoginData('Test', '172.68.99.218', 8080, false);
  let activeApp: Application = new Application('test3', '', '', false, false, 8080, []);
  let virtualTile: VirtualTile = new VirtualTile();

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
    TestBed.resetTestingModule();
  }));

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Tiles,
                VirtualTilesPage,
            ],
            providers: [
              AlertController,
              BLE,
              BleService,
              DevicesService,
              Diagnostic,
              Events,
              MqttClient,
              UtilsService,
              { provide: TilesApi, useValue: tilesApi },
              { provide: BackgroundFetch, useClass: BackgroundFetchMock },
              { provide: Storage, useClass: StorageMock },
              { provide: NavParams, useClass: NavParamsMock },
              { provide: NavController, useClass: NavMock},
            ],
            imports: [
                IonicModule.forRoot(Tiles),
            ],
        }).compileComponents();
    }));

    beforeEach( () => {
        fixture = TestBed.createComponent(VirtualTilesPage);
        virtualTiles = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        virtualTiles = null;
    });

    it('is created', () => {
        expect(fixture).toBeTruthy();
        expect(virtualTiles).toBeTruthy();
    });

});
