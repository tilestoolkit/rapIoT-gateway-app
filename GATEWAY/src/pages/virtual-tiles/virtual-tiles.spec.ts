import { Component, forwardRef } from '@angular/core';
import { Tiles } from '../../app/app.component';
import { IonicModule, AlertController, Events, NavController, NavParams } from 'ionic-angular';
import { NavParamsMock, NavMock } from "../../mocks.ts";
import { BleService } from '../../providers/ble.service';
import { DevicesService } from '../../providers/devices.service';
import { TilesApi } from '../../providers/tilesApi.service';
import { Application,VirtualTile, UtilsService } from '../../providers/utils.service';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { VirtualTilesPage } from "../../pages/virtual-tiles/virtual-tiles";

let VirtualTiles: VirtualTilesPage;
let fixture: ComponentFixture<VirtualTiles>;

describe('virtual-tiles', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Tiles,
                VirtualTilesPage,
            ],
            providers: [
              AlertController,
              Events,
              BleService,
              DevicesService,
              TilesApi,
              UtilsService,
              Application,
              VirtualTile,
              { provide: NavParams, useClass: NavParamsMock },
              { provide: NavController, useClass: NavMock},
            ],
            imports: [
                IonicModule.forRoot(Tiles),
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VirtualTiles);
        VirtualTiles = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        VirtualTiles = null;
    });

    it('is created', () => {
        expect(fixture).toBeTruthy();
        expect(VirtualTiles).toBeTruthy();
    });
