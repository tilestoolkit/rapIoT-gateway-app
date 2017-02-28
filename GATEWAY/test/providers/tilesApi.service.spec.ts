import 'reflect-metadata';
import 'mocha';
import { assert, expect } from 'chai';
import { CommandObject, TilesApi } from '../../src/providers/tilesApi.service'

describe ('TilesApi', () => {
    beforeEach( () => {
      //this.tilesapi = new TilesApi();
    });

    it('should return an object with name and properties from the input string', () =>{
      const eventStringAsObject = this.tilesapi.getEventStringAsObject("this,is,stuff");
      assert.equal(eventStringAsObject.length, 2);
    });

});
