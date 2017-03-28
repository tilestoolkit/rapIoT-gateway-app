import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BLE } from '@ionic-native/ble';
import { Tiles } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { MqttClient } from '../providers/mqttClient';
import { TilesApi } from '../providers/tilesApi.service';
import { StorageMock } from '../mocks';
 
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
                {
                    provide: Storage,
                    useClass: StorageMock
                },
                BLE,
                MqttClient,
                TilesApi
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