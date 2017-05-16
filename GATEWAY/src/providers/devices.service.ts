import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

import { Device } from './utils.service';

@Injectable()
export class DevicesService {
  public devices: Device[];
  constructor(public storage: Storage,
              public events: Events) {
    this.devices = [];
  }

  /**
   * Converts the device discovered by ble into a device on the tiles format
   * @param {any} bleDevice - the returned device from the ble scan
   */
  public convertBleDeviceToDevice = (bleDevice: any): Promise<Device>  => {
    return this.storage.get(bleDevice.name).then( name => {
      const deviceName = (name !== null && name !== undefined) ? name : bleDevice.name;
      return new Device(bleDevice.id, bleDevice.name, deviceName, false);
    }).catch(err => {
      return new Device(bleDevice.id, bleDevice.name, bleDevice.name, false);
    });
  }

  /**
   * Returns the list of devices currently stored
   */
  public getDevices = (): Device[] => {
    return this.devices;
  }

  /**
   * Adds a new device to the list of devices
   * @param {Device} device - the device to add
   */
  public newDevice = (device: Device) => {
    if (!this.devices.map(storedDevice => storedDevice.tileId).includes(device.tileId)) {
      this.devices.push(device);
      this.events.publish('updateDevices');
    }
  }

  /**
   * Sets a custom name for the device
   * @param {Device} device - a tile device
   * @param {string} name - the new name for the device
   */
  public setCustomDeviceName = (device: Device, name: string): void => {
    this.storage.set(device.tileId, name);
    this.devices = this.devices.map(storedDevice => {
      storedDevice.name = storedDevice.tileId === device.tileId
                        ? name
                        : storedDevice.name;
      return storedDevice;
    });
    this.events.publish('updateDevices');
  }

  /**
   * Sets the device name to the ble name
   * @param {Device} device - a tile device
   */
  public resetDeviceName = (device: Device): void => {
    this.setCustomDeviceName(device, device.tileId);
    this.events.publish('updateDevices');
  }

  /**
   * Remove a device from the list
   * @param {Device} device - a tile device
   */
  public removeDevice = (device: Device): void => {
    this.devices = this.devices.filter(storedDevice => storedDevice.tileId !== device.tileId);
    this.events.publish('updateDevices');
  }

  /**
   * set the connection status of a device
   * @param {Device} device - a tile device
   * @param {boolean} status - the new connection status
   */
  public setDeviceConnectionStatus = (device: Device, status: boolean): void => {
    this.devices = this.devices.map(storedDevice => {
      if (storedDevice.tileId === device.tileId) {
        storedDevice.connected = status;
        storedDevice.lastDiscovered = (new Date()).getTime();
      }
      return storedDevice;
    });
    this.events.publish('updateDevices');
  }

  /**
   * Reset the last time a device was discovered
   * @param {Device} device - a tile device
   */
  public deviceDiscovered = (device: Device): void => {
    this.devices = this.devices.map(storedDevice => {
      if (storedDevice.tileId !== device.tileId) {
        storedDevice.lastDiscovered = (new Date()).getTime();
      }
      return storedDevice;
    });
    this.events.publish('updateDevices');
  }

  /**
   * Go through the list of registered devices and keep only those connected
   */
  public clearDisconnectedDevices = (): void => { // TODO: Change name?
    const currentTime = (new Date()).getTime();
    this.devices = this.devices.filter(device => {
      // devices not connected and not discovered in the past 10 seconds will be removed
      return currentTime - device.lastDiscovered < 10000 || device.connected;
    });
    this.events.publish('updateDevices');
  }
}
