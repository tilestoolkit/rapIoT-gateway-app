import { Tiles } from '../../app/app.component';
import { Component } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Storage } from '@ionic/storage';
import { BLE } from '@ionic-native/ble';
import { IonicModule, ViewController, AlertController, NavController, NavParams, ModalController } from 'ionic-angular';
import { ApplicationsPage } from './applications';
import { BleService } from '../../providers/ble.service';
import { DevicesService } from '../../providers/devices.service';
import { MqttClient } from '../../providers/mqttClient';
import { TilesApi } from '../../providers/tilesApi.service';
import { Logger } from '../../providers/logger.service';
import { Application, UtilsService } from '../../providers/utils.service';
import { StorageMock, ViewControllerMock, BackgroundFetchMock, NavMock, NavParamsMock } from '../../mocks';


let appications: ApplicationsPage;
let fixture: ComponentFixture<ApplicationsPage>;

describe('applications', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Tiles,
                ApplicationsPage,
            ],
            providers: [
                Logger,
                UtilsService,
                MqttClient,
                TilesApi,
                DevicesService,
                AlertController,
                BleService,
                Diagnostic,
                BLE,
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: Storage, useClass: StorageMock },
                { provide: BackgroundFetch, useClass: BackgroundFetchMock },
            ],
            imports: [
                IonicModule.forRoot(Tiles),
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationsPage);
        appications = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        appications = null;
    });

    it('is created', () => {
        expect(appications).toBeTruthy();
        expect(fixture).toBeTruthy();
    });

});
