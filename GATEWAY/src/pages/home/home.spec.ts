import { HomePage } from '../../../src/pages/home/home';
import { Tiles } from '../../../src/app/app.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

let comp: HomePage;
let fixture: ComponentFixture<HomePage>;
 
describe('HomePage', () => {
 
    beforeEach(async(() => {
        TestBed.configureTestingModule({
 
            declarations: [
                Tiles,
                HomePage
            ],
             
            providers: [
                Storage,
                NavController
            ],
            imports: [
                IonicModule.forRoot(Tiles)
            ]
 
        }).compileComponents();
    }));
 
    beforeEach(() => {
 
        fixture = TestBed.createComponent(HomePage);
        comp    = fixture.componentInstance;
 
    });
 
    afterEach(() => {
        fixture.destroy();
        comp = null;
    });
 
    it('is created', () => {
 
        expect(fixture).toBeTruthy();
        expect(comp).toBeTruthy();
 
    });

    xit('should reach the end of the code block and write "Done scanning" in scanForNewBLEDevices()', ()=> {
      expect(this.homepage.scanForNewBLEDevices.statusMsg).toEqual('Done scanning');
    });

    xit('should scan and find at least one new device in scanForNewBLEDevices()', () => {
      // TODO: There should be setup for a mock-BLEdevice here in the near future
      const newBLE = '';
      expect(this.homepage.scanForNewBLEDevices.newDevices.length).toEqual(1);
    });

    xit('should return true using the given credentials when logging, using the verifyLoginCredentials()', () => {
      // TODO: There should be replacement with real mock-credentials here
      const name: String = 'username123';
      const host: String = 'host123';
      const port: String = 'port123';
      expect(this.homepage.verifyLoginCredentials(name, host, port)).toEqual(true);
    });

    xit('should return false using the given credentials when logging, using the verifyLoginCredentials()', ()=> {
      // TODO: There should be replacement with real mock-credentials here
      const name:String = 'wrongName123';
      const host:String = 'wronghost123';
      const port:String = '1111';
      expect(this.homepage.verifyLoginCredentials(name, host, port)).toEqual(false);
    });


});
