import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { BLE } from '@ionic-native/ble';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import { Diagnostic } from '@ionic-native/diagnostic';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Injectable } from "@angular/core";
import { IonicModule, Events, NavController, AlertController, Alert  } from 'ionic-angular';
import { Tiles } from '../../app/app.component';
import { BleService } from '../../providers/ble.service';
import { DevicesService } from '../../providers/devices.service';
import { TilesApi } from '../../providers/tilesApi.service';
import { MqttClient } from '../../providers/mqttClient';
import { UtilsService, Device } from '../../providers/utils.service';
import { Logger } from '../../providers/logger.service';
import { PhysicalTilesPage } from "./physical-tiles";
import { StorageMock, BackgroundFetchMock } from '../../mocks';

let physicalTiles: PhysicalTilesPage;
let fixture: ComponentFixture<PhysicalTilesPage>;

describe('physical-tiles', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Tiles,
                PhysicalTilesPage,
            ],
            providers: [
              Logger,
              NavController,
              AlertController,
              Events,
              BleService,
              DevicesService,
              Diagnostic,
              BLE,
              MqttClient,
              TilesApi,
              UtilsService,
            {
                provide: Storage,
                useClass: StorageMock
            },
            {
                provide: BackgroundFetch,
                useClass: BackgroundFetchMock
            },
            ],
            imports: [
                IonicModule.forRoot(Tiles),
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PhysicalTilesPage);
        physicalTiles = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        physicalTiles = null;
    });

    xit('is created', () => {
        expect(fixture).toBeTruthy();
        expect(physicalTiles).toBeTruthy();
    });

    describe('refreshDevices(refresher): void', () => {

        it('should refresh list of devices after checking if ble is enabled', () => {
            let devices: Device[];
            let refresher: any;
            let checkBleSpy = spyOn(physicalTiles.bleService, 'checkBleEnabled');
            let getDevicesSpy = spyOn(physicalTiles.devicesService, 'getDevices').and.callFake( () => {
                return devices;
            });
            spyOn(window, 'setTimeout');

            physicalTiles.ionViewWillEnter();

            expect(physicalTiles.devices).toEqual(devices);
            expect(checkBleSpy).toHaveBeenCalled();
        });

    });

    describe('changeNamePop(device: Device): void', () => {

        it('should create an alert to change name of a device', () => {
            let device = new Device('01:23:45:67:89:AB', 'Tile_9e', 'Tile_9e', false);
            let alertSpy = spyOn(physicalTiles.alertCtrl, 'create').and.callThrough();
            spyOn(Alert.prototype, 'present');

            physicalTiles.changeNamePop(device);

            expect(alertSpy).toHaveBeenCalled();
        });

    });

    describe('ionViewWillEnter()', () => {

        it('should get devices from devicesService', () => {
            let devices: Device[];
            let checkBleSpy = spyOn(physicalTiles.bleService, 'checkBleEnabled');
            let getDevicesSpy = spyOn(physicalTiles.devicesService, 'getDevices').and.callFake( () => {
                return devices;
            });

            physicalTiles.ionViewWillEnter();

            expect(physicalTiles.devices).toEqual(devices);

        });

        it('should invoke methods setVirtualTiles and bleService.checkBleEnabled', () => {
            let checkBleSpy = spyOn(physicalTiles.bleService, 'checkBleEnabled');
            let getDevicesSpy = spyOn(physicalTiles.devicesService, 'getDevices');

            physicalTiles.ionViewWillEnter();

            expect(checkBleSpy).toHaveBeenCalled();
        });
    });
});
