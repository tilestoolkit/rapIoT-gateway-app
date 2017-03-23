import { HomePage } from './home';
import { Tiles } from '../../app/app.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsService }from '../../providers/utils.service';
import { StorageMock } from '../../mocks';

let homePage: HomePage;
let fixture: ComponentFixture<HomePage>;
 
describe('HomePage', () => {
 
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Tiles,
                HomePage,
            ],
            providers: [
                {
                provide: Storage,
                useClass: StorageMock
                },
                NavController,
                UtilsService,
            ],
            imports: [
                IonicModule.forRoot(Tiles),
            ],
        }).compileComponents();
    }));
 
    beforeEach(() => {
        fixture = TestBed.createComponent(HomePage);
        homePage    = fixture.componentInstance;
    });
 
    afterEach(() => {
        fixture.destroy();
        homePage = null;
    });
 
    it('is created', () => {
        expect(fixture).toBeTruthy();
        expect(homePage).toBeTruthy();
    });

    describe('setDevices(): void', () => {

    });

    describe('setVirtualTiles(): void', () => {

    });

    describe('scanForBLEDevices(): void', () => {

    });

    describe('connectToServer(user: string, host: string, port: number): void', () => {

    });

    describe('refreshDevices(refresher): void', () => {

    });

    describe('identifyDevice(device: Device): void', () => {

    });

    describe('showMQTTPopup()', () => {

    });

    describe('changeNamePop(device: Device): void', () => {

    });

    describe('pairTilePopUp(virtualTile: VirtualTile): void', () => {

    });

});
