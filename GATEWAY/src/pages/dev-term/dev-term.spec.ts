import { Tiles } from '../../app/app.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule, NavController, NavParams } from 'ionic-angular';
import { UtilsService }from '../../providers/utils.service';
import { DevTermPage } from './dev-term';
import { MqttClient } from '../../providers/mqttClient';
import { TilesApi } from '../../providers/tilesApi.service';
import { NavParamsMock, BackgroundFetchMock, StorageMock } from '../../mocks';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import { Storage } from '@ionic/storage';


let devTerminal: DevTermPage;
let fixture: ComponentFixture<devTerminal>;

describe('dev-terminal', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Tiles,
                DevTermPage,
            ],
            providers: [
                NavController,
                UtilsService,
                MqttClient,
                TilesApi,
                { provide: Storage, useClass: StorageMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: BackgroundFetch, useClass: BackgroundFetchMock},
            ],
            imports: [
                IonicModule.forRoot(Tiles),
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DevTermPage);
        devTerminal = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        devTerminal = null;
    });

    it('is created', () => {
        expect(fixture).toBeTruthy();
        expect(devTerminal).toBeTruthy();
    });

    describe('addNewMessage(message)', () => {

      it('should add a new message to the messages list', () => {
        let exampleMessage: string = 'This is a test';

        devTerminal.addNewMessage(exampleMessage);

        expect(devTerminal.messages[0].text).toEqual(exampleMessage);
      });

    });

    describe('clearTerminal(): void', () => {

      it('should clear messages from the terminal window', () => {
        devTerminal.messages = [1,2,3];

        devTerminal.clearTerminal();

        expect(devTerminal.messages.length).toEqual(0);
      });

    });

    describe('scrollBottomOfList(): void', () => {
      //TODO: Needs to have access to pixelated veiws to work
    });

    describe('jumpBottomOfList(): void', () => {
      //TODO: Needs to have access to pixelated veiws to work
    });

    describe('getListLocation(): void', () => {
      //TODO: Needs to have access to pixelated veiws to work
    });
});
