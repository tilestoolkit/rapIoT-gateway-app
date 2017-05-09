import { Tiles } from '../../app/app.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule, ViewController, AlertController } from 'ionic-angular';
import { LoginPage } from './login';
import { UtilsService, LoginData  }from '../../providers/utils.service';
import { MqttClient } from '../../providers/mqttClient';
import { TilesApi } from '../../providers/tilesApi.service';
import { StorageMock, ViewControllerMock } from '../../mocks';


let logIn: LoginPage;
let fixture: ComponentFixture<logIn>;

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
                LoginData,
                { provide: ViewController, useClass: ViewControllerMock },
                { provide: Storage, useClass: StorageMock },
            ],
            imports: [
                IonicModule.forRoot(Tiles),
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        let logindata = 
        fixture = TestBed.createComponent(logIn);
        logIn = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        logIn = null;
    });
    /*it('is created', () => {
        expect(fixture).toBeTruthy();
        expect(logIn).toBeTruthy();
    });
    */
