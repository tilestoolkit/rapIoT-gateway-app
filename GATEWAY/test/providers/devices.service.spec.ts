import 'reflect-metadata';
import 'mocha';
import { assert, expect } from 'chai';
import { DevicesService, Device } from '../../src/providers/devices.service';


describe('DevicesService', () => {
    beforeEach( () => {
        this.devicesService = new DevicesService();
    });

  it('should have an empty list "devices" after construction', () => {
    const devices = new DevicesService();
    assert.equal(devices.getDevices().length, 0);
  });

  it('should return a list with three mock devices when running `getMockDevices()`', () => {
      const devices = this.devicesService.getMockDevices();
      assert.equal(devices.length, 3);
  })
});