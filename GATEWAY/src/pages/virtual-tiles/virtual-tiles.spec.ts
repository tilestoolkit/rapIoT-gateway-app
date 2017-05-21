import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { BLE } from '@ionic-native/ble';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import { Diagnostic } from '@ionic-native/diagnostic';
import { IonicModule, AlertController, AlertOptions, Alert, Events, NavController, NavParams } from 'ionic-angular';
import { Tiles } from '../../app/app.component';
import { NavParamsMock, NavMock, StorageMock, BackgroundFetchMock } from "../../mocks";
import { BleService } from '../../providers/ble.service';
import { DevicesService } from '../../providers/devices.service';
import { TilesApi } from '../../providers/tilesApi.service';
import { MqttClient } from '../../providers/mqttClient';
import { Logger } from '../../providers/logger.service';
import { Application, Device, LoginData, VirtualTile, UtilsService } from '../../providers/utils.service';
import { VirtualTilesPage } from "../../pages/virtual-tiles/virtual-tiles";

import { App, Config, Platform } from 'ionic-angular';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, ResponseOptions, BaseRequestOptions, RequestMethod } from '@angular/http';

let virtualTilesPage: VirtualTilesPage;
let fixture: ComponentFixture<VirtualTilesPage>;
let spyError: jasmine.Spy;
/*
let alertPair: AlertOptions = {
        title: 'Pair to physical tile',
        inputs: [{type: 'radio', name: 'deviceId', value: 'Tile_9e', label: 'Tile_9e'}],
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          },
          {
            text: 'Pair',
            handler: data => {
              this.tilesApi.pairDeviceToVirualTile(data, 'Tile').then(
                res => this.setVirtualTiles()
              );
            },
        }],
        enableBackdropDismiss: true,
      };
let alertDismiss: AlertOptions = {
        title: 'Pair to physical tile',
        message: 'No physical tiles nearby.',
        buttons: ['Dismiss']};
*/
describe('virtual-tiles', () => {
  let tilesApi: TilesApi = null;
  let loginData: LoginData = new LoginData('Test', '172.68.99.218', 8080, false);
  let activeApp: Application = new Application('test3', '', '', false, false, 8080, []);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        App,
        Config,
        Logger,
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
            Logger,
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
      virtualTilesPage = fixture.componentInstance;
  });

  afterEach(() => {
      fixture.destroy();
      virtualTilesPage = null;
  });

  it('is created', () => {
      expect(fixture).toBeTruthy();
      expect(virtualTilesPage).toBeTruthy();
  });

  describe('setVirtualTile(): void', () => {

    it('should get the virtual tiles of an app', async( () =>  {

      let virtualTile: VirtualTile[];
      let getAppSpy = spyOn(virtualTilesPage.tilesApi, 'getVirtualTiles').and.callFake( () => {
        return new Promise( (resolve) => {
          Promise.resolve(virtualTile);
        });
      });

      virtualTilesPage.setVirtualTiles();
      expect(virtualTilesPage.virtualTiles).toEqual(virtualTile);

    }));

  });

  describe('refreshVirtualTiles(refresher): void', () => {

    it('should get devices from devicesService', () => {
      let devices: Device[];
      let refresher: any;
      let setAppSpy = spyOn(virtualTilesPage, 'setVirtualTiles');
      let checkBleSpy = spyOn(virtualTilesPage.bleService, 'checkBleEnabled');
      let getDevicesSpy = spyOn(virtualTilesPage.devicesService, 'getDevices').and.callFake( () => {
        return devices;
      });
      spyOn(window, 'setTimeout');

      virtualTilesPage.refreshVirtualTiles(refresher);

      expect(virtualTilesPage.devices).toEqual(devices);

    });

    it('should invoke methods setVirtualTiles and bleService.checkBleEnabled', () => {
      let refresher: any;
      let setAppSpy = spyOn(virtualTilesPage, 'setVirtualTiles');
      let checkBleSpy = spyOn(virtualTilesPage.bleService, 'checkBleEnabled');
      let getDevicesSpy = spyOn(virtualTilesPage.devicesService, 'getDevices');
      spyOn(window, 'setTimeout');

      virtualTilesPage.refreshVirtualTiles(refresher);

      expect(setAppSpy).toHaveBeenCalled();
      expect(checkBleSpy).toHaveBeenCalled();
    });

  });

  describe('pairTilePopUp(virtualTile: VirtualTile): void', () => {

    it('should create an alert with radiobuttons for devices if devices.length > 0', () => {
      virtualTilesPage.devices = [new Device('01:23:45:67:89:AB', 'Tile_9e', 'Tile_9e', false)];
      let virtualTile = new VirtualTile();
      virtualTile._id = "Tile";
      let alertSpy = spyOn(virtualTilesPage.alertCtrl, 'create').and.callThrough();
      spyOn(Alert.prototype, 'present');

      virtualTilesPage.pairTilePopUp(virtualTile);

      expect(alertSpy).toHaveBeenCalled();
    });

    it('should create an alert with radiobuttons for devices if devices.length = 0', () => {
      virtualTilesPage.devices = [];
      let virtualTile = new VirtualTile();
      virtualTile._id = "Tile";
      let alertSpy = spyOn(virtualTilesPage.alertCtrl, 'create').and.callThrough();
      spyOn(Alert.prototype, 'present');

      virtualTilesPage.pairTilePopUp(virtualTile);

      expect(alertSpy).toHaveBeenCalled();
    });
  });

  describe('unpairTile(virtualTile: VirtualTile): void', () => {

    it('should "pair" the virtual tile with null and refresh list of virtual tiles', () => {
      let pairSpy = spyOn(virtualTilesPage.tilesApi, 'pairDeviceToVirtualTile').and.callFake( () => {
        return new Promise( (resolve) => {
          Promise.resolve();
        });
      });
      let setAppSpy = spyOn(virtualTilesPage, 'setVirtualTiles');

        let virtualTile = new VirtualTile();
        virtualTile._id = "Tile";

      virtualTilesPage.unpairTile(virtualTile);

      expect(pairSpy).toHaveBeenCalledWith(null, "Tile");
    });
  });

  describe('ionViewWillEnter()', () => {

    it('should get devices from devicesService', () => {
      let devices: Device[];
      let setAppSpy = spyOn(virtualTilesPage, 'setVirtualTiles');
      let checkBleSpy = spyOn(virtualTilesPage.bleService, 'checkBleEnabled');
      let getDevicesSpy = spyOn(virtualTilesPage.devicesService, 'getDevices').and.callFake( () => {
        return devices;
      });

      virtualTilesPage.ionViewWillEnter();

      expect(virtualTilesPage.devices).toEqual(devices);

    });

    it('should invoke methods setVirtualTiles and bleService.checkBleEnabled', () => {
      let setAppSpy = spyOn(virtualTilesPage, 'setVirtualTiles');
      let checkBleSpy = spyOn(virtualTilesPage.bleService, 'checkBleEnabled');
      let getDevicesSpy = spyOn(virtualTilesPage.devicesService, 'getDevices');

      virtualTilesPage.ionViewWillEnter();

      expect(setAppSpy).toHaveBeenCalled();
      expect(checkBleSpy).toHaveBeenCalled();
    });

  });

});
