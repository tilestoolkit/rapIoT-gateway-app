import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { BLE } from '@ionic-native/ble';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import { Diagnostic } from '@ionic-native/diagnostic';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Injectable } from "@angular/core";
import { IonicModule, Events, NavController, AlertController  } from 'ionic-angular';
import { Tiles } from '../../app/app.component';
import { BleService } from '../../providers/ble.service';
import { DevicesService } from '../../providers/devices.service';
import { TilesApi } from '../../providers/tilesApi.service';
import { MqttClient } from '../../providers/mqttClient';
import { UtilsService, Device } from '../../providers/utils.service';
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

    it('is created', () => {
        expect(fixture).toBeTruthy();
        expect(physicalTiles).toBeTruthy();
    });
});
