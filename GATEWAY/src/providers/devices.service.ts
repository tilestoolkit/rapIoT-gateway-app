import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

import { Device } from './utils.service';

@Injectable()
export class DevicesService {
  public devices: Device[];
  public flagThen: boolean = false;
  public flagCatch: boolean = false;

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
      this.flagThen = true;
      const deviceName = (name !== null && name !== undefined) ? name : bleDevice.name;
      return new Device(bleDevice.id, bleDevice.name, deviceName, false);
    }).catch(err => {
      this.flagCatch = true;
      return new Device(bleDevice.id, bleDevice.name, bleDevice.name, false);
    });
  }

  /**
   * Adds a new device to the list of devices
   * @param {Device} device - the device to add
   */
  public newDevice = (device: Device) => {
    if (!this.devices.map(storedDevice => storedDevice.tileId).includes(device.tileId)) {
      this.devices.push(device);
    }
  }

  /**
   * Sets a custom name for the device
   * @param {Device} device - a tile device
   * @param {string} name - the new name for the device
   */
  public setCustomDeviceName = (device: Device, name: string): void => {
    this.storage.set(device.tileId, name);
    this.devices.map(storedDevice => storedDevice.name = storedDevice.tileId === device.tileId
                                                       ? name : storedDevice.name);
    this.events.publish('updateDevices');
  }

  /**
   * Sets the device name to the ble name
   * @param {Device} device - a tile device
   */
  public resetDeviceName = (device: Device): void => {
    this.setCustomDeviceName(device, device.tileId);
  }

  /**
   * Go through the list of registered devices and keep only those connected
   */
  public clearDisconnectedDevices = (): void => { // TODO: Change name?
    const currentTime = (new Date()).getTime();
    this.devices = this.devices.filter(device => currentTime - device.lastDiscovered < 60000);
  }
}
