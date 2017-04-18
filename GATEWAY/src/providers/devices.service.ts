import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

import { Device } from './utils.service';

@Injectable()
export class DevicesService {
  private devices: Device[];

  constructor(public storage: Storage,
              public events: Events) {
    this.devices = [];
  }

  /**
   * Returns the list of devices currently stored
   */
  getDevices = (): Device[] => {
    return this.devices;
  }

  /**
   * Sets the list of devices
   * @param {Device[]} devices - New list of devices
   */
  setDevices = (devices: Array<Device>) => {
    // Only keep devices that were still found by the BLE
    this.devices.filter(device => devices.map(newDevice => newDevice.id).includes(device.id));
    // Add the new devices found
    devices.forEach(device => this.newDevice(device));
    this.events.publish('updateDevices');
  }

  /**
   * Converts the device discovered by ble into a device on the tiles format
   * @param {any} bleDevice - the returned device from the ble scan
   */
  convertBleDeviceToDevice = (bleDevice: any): Promise<Device>  => {
    return this.storage.get(bleDevice.name).then( name => {
      const deviceName = (name !== null && name !== undefined) ? name : bleDevice.name;
      return new Device(bleDevice.id, bleDevice.name, deviceName, false);
    }).catch(err => {
      return new Device(bleDevice.id, bleDevice.name, bleDevice.name, false);
    });
  }

  /**
   * Adds a new device to the list of devices
   * @param {Device} device - the device to add
   */
  newDevice = (device: Device) => {
    if (!this.devices.map(storedDevice => storedDevice.tileId).includes(device.tileId)) {
      this.devices.push(device);
    }
  }

  /**
   * Sets a custom name for the device
   * @param {Device} device - a tile device
   * @param {string} name - the new name for the device
   */
  setCustomDeviceName = (device: Device, name: string): void => {
    this.storage.set(device.tileId, name);
    this.devices.map(storedDevice => storedDevice.name = storedDevice.tileId === device.tileId
                                                       ? name : storedDevice.name);
    this.events.publish('updateDevices');
  }

  /**
   * Sets the device name to the ble name
   * @param {Device} device - a tile device
   */
  resetDeviceName = (device: Device): void => {
    this.setCustomDeviceName(device, device.tileId);
  }

  /**
   * Go through the list of registered devices and keep only those connected
   */
  clearDisconnectedDevices = (): void => {
    this.devices = this.devices.filter(device => device.connected);
  }
}
