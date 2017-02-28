import 'reflect-metadata';
import 'mocha';
import { assert, expect } from 'chai';
import { MqttClient } from '../../src/providers/mqttClient';

describe('MqttClient', () => {
    beforeEach( () => {
      //this.mqttclient = new MqttClient();
    });
    it('should return a string that is an url to the specific device running the getDeviceSpecificTopic() method. This test does NOT involve an event trigger', () => {
      const deviceID: String = "trollydrolly";
      // TODO: change the testUsername in the last argument of assert.equal to a propper test username from the mqttclient
      assert.equal(this.mqttclient.getDeviceSpecificTopic(deviceID, false), 'tiles/false/testUsername/' + deviceID);
    });
    
    it('should return a string that is an url to the specific device when running the getDeviceSpecificTopic() method. This test DOES involve an event trigger', () => {
      const deviceID: String = "trollydrolly";
      // TODO: change the testUsername in the last argument of assert.equal to a propper test username from the mqttclient
      // TODO: Make sure that an event is called with the test AKA send to the correct device.
      assert.equal(this.mqttclient.getDeviceSpecificTopic(deviceID, true), 'tiles/true/testUsername/' + deviceID);
    });

    it('should return false when we change the connection status to the server with setServerConnectionStatus() ', () => {
      const falseConnection = false;
      assert.strictEqual(this.mqttclient.setServerConnectionStatus(falseConnection), false);
    });

    it('should return true when we change the connection status to the server with setServerConnectionStatus()', () => {
      const trueConnection = true;
      assert.strictEqual(this.mqttclient.setServerConnectionStatus(trueConnection), true);
    });

});
