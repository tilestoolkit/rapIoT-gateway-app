import 'reflect-metadata';
import 'mocha';
import { assert, expect } from 'chai';
import { HomePage } from '../../../src/pages/home/home';

describe('HomePage', () => {
    beforeEach( () => {
      //this.homepage = new HomePage();
    });

    it('should reach the end of the code block and write "Done scanning" in scanForNewBLEDevices()', ()=> {
      assert.equal(this.homepage.scanForNewBLEDevices.statusMsg, 'Done scanning');
    });

    it('should scan and find at least one new device in scanForNewBLEDevices()', () => {
      // TODO: There should be setup for a mock-BLEdevice here in the near future
      const newBLE = '';
      assert.equal(this.homepage.scanForNewBLEDevices.newDevices.length, 1);
    });

    it('should return true using the given credentials when logging, using the verifyLoginCredentials()', () => {
      // TODO: There should be replacement with real mock-credentials here
      const name: String = 'username123';
      const host: String = 'host123';
      const port: String = 'port123';
      assert.equal(this.homepage.verifyLoginCredentials(name, host, port), true);
    });

    it('should return false using the given credentials when logging, using the verifyLoginCredentials()', ()=> {
      // TODO: There should be replacement with real mock-credentials here
      const name:String = 'wrongName123';
      const host:String = 'wronghost123';
      const port:String = '1111';
      assert.equal(this.homepage.verifyLoginCredentials(name, host, port), false);
    });


});
