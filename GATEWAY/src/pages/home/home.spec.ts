import { HomePage } from './home';
import { Tiles } from '../../app/app.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsService }from '../../providers/utils.service';

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
                Storage,
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


});
