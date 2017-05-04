import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BLE } from '@ionic-native/ble';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import { Diagnostic } from '@ionic-native/diagnostic';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Tiles } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { MqttClient } from '../providers/mqttClient';
import { TilesApi } from '../providers/tilesApi.service';
import { StorageMock, BackgroundFetchMock, BackgroundModeMock } from '../mocks';

let tiles: Tiles;
let fixture: ComponentFixture<Tiles>;

describe('App Component', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [Tiles],
            imports: [
                IonicModule.forRoot(Tiles)
            ],
            providers: [
                BLE,
                MqttClient,
                TilesApi,
                Diagnostic,
                {
                provide: BackgroundMode,
                useClass: BackgroundModeMock
                },
                {
                    provide: Storage,
                    useClass: StorageMock
                },
                {
                provide: BackgroundFetch,
                useClass: BackgroundFetchMock
                },
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Tiles);
        tiles    = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        tiles = null;
    });

    it('is created', () => {
        expect(fixture).toBeTruthy();
        expect(tiles).toBeTruthy();
    });

    it('initialises with a root page of TabsPage', () => {
        expect(tiles['rootPage']).toBe(TabsPage);
    });

});
