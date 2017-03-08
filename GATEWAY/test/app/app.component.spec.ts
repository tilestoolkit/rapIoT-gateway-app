import 'reflect-metadata';
import 'mocha';
import 'zone.js';
import { assert, expect } from 'chai';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { PlatformMock } from '../fixtures/mocks/mock';
import { AppVersion, StatusBar, Splashscreen } from 'ionic-native';
import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
//import { IonicModule } from 'ionic-angular';

import { Tiles } from '../../src/app/app.component';
let comp: Tiles;
let fixture: ComponentFixture<Tiles>;
let window;
 
describe('test import of platform', () => {
 
    beforeEach(() => {
        this.window = { location : { host : 'example.com' } };
        const platformMock = new PlatformMock();
        /*
        TestBed.configureTestingModule({
 
            declarations: [
                Tiles
            ],
             
            providers: [

            ]
 
        }).compileComponents();
        */
    });
        
    it('should work', () => {
            assert.equal(true, true);
    });
});