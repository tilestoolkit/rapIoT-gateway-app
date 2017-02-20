import 'reflect-metadata';
import 'mocha';
import { assert, expect } from 'chai';
import { DevicesService, Device } from '../../src/providers/devices.service';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line

describe('Test-test on devices.service', () => {
    beforeEach( () => {
        this.devicesService = new DevicesService();
    });

  it('should have an empty list "devices" after construction', () => {
    const devices = new DevicesService();
    assert.equal(devices.getDevices().length, 0);
  });

  it('running getMockDevices should return three devices', () => {
      const devices = this.devicesService.getMockDevices();
      assert.equal(devices.length, 3);
  })
});