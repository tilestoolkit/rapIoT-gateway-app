import { Tiles } from '../../app/app.component';
import { Component } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import { Storage } from '@ionic/storage';
import { IonicModule, ViewController, AlertController } from 'ionic-angular';
import { LoginPage } from './login';
import { UtilsService, LoginData  }from '../../providers/utils.service';
import { MqttClient } from '../../providers/mqttClient';
import { TilesApi } from '../../providers/tilesApi.service';
import { StorageMock, ViewControllerMock, BackgroundFetchMock } from '../../mocks';


let logIn: LoginPage;
let fixture: ComponentFixture<LoginPage>;

describe('logIn', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Tiles,
                LoginPage,
            ],
            providers: [
                UtilsService,
                MqttClient,
                TilesApi,
                AlertController,
                { provide: Storage, useClass: StorageMock },
                { provide: ViewController, useClass: ViewControllerMock },
                { provide: BackgroundFetch, useClass: BackgroundFetchMock },
            ],
            imports: [
                IonicModule.forRoot(Tiles),
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginPage);
        logIn = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        logIn = null;
    });

    it('is created', () => {
        expect(logIn).toBeTruthy();
        expect(fixture).toBeTruthy();
    });

});
