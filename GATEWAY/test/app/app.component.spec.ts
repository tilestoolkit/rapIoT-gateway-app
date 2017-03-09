import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { Tiles } from '../../src/app/app.component';
import { TabsPage } from '../../src/pages/tabs/tabs';

let comp: Tiles;
let fixture: ComponentFixture<Tiles>;
 
describe('test import of platform', () => {
 
    beforeEach(async(() => {
        TestBed.configureTestingModule({
 
            declarations: [
                Tiles
            ],
             
            providers: [
                
            ],
            imports: [
                IonicModule.forRoot(Tiles)
            ]
 
        }).compileComponents();
    }));
 
    beforeEach(() => {
 
        fixture = TestBed.createComponent(Tiles);
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
 
    it('initialises with a root page of TabsPage', () => {
        expect(comp['rootPage']).toBe(TabsPage);
    });
});