import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { Tiles } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';

let tiles: Tiles;
let fixture: ComponentFixture<Tiles>;

describe('Component: Root Component', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [Tiles],
            imports: [
                IonicModule.forRoot(Tiles)
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
