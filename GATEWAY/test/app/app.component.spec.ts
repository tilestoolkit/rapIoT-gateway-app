import 'reflect-metadata';
import 'mocha';
import { assert, expect } from 'chai';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AppVersion, StatusBar, Splashscreen } from 'ionic-native';


describe('test import of platform', () => {

    beforeEach(() => {
    const window = { location : { host : 'example.com' } };
        
    });

    it('should work', () => {
        assert.equal(true, true);
    })
});