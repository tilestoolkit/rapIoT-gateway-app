import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

/**
 * Class to describe the structure of an application
 */
export class Application {
  _id: string;
  devEnvironment: string;
  user: string;
  environmentOnline: boolean;
  appOnline: boolean;
  port: number;
  virtualTiles: string[];
}

/**
 * Class to describe the structure of a command
 */
export class CommandObject {
  constructor(name: string, properties: string[]) {
    this.name = name;
    this.properties = properties;
  }
  name: string;
  properties: string[];
}

/**
 * Class for the devices, this makes it possible to specify the
 * device type in typescript to avoid getting invalid device-objects
 */
export class Device {
  constructor(id: string, tileId: string, name: string, connected: boolean, lastDiscovered?: number) {
    this.id = id;
    // IOS and android gets different id from the ble, so we use the tilename as a second id
    this.tileId = tileId;
    this.name = name;
    this.connected = connected;
    this.lastDiscovered = lastDiscovered !== undefined ? lastDiscovered : (new Date).getTime();
  }
  id: string;
  tileId: string;
  name: string;
  connected: boolean;
  lastDiscovered: number;
}

/**
 * Class to describe a login data object
 */
export class LoginData {
  constructor(user: string, host: string, port: number, remember?: boolean) {
    this.user = user;
    this.host = host;
    this.port = port;
    this.remember = remember;
  }
  user: string;
  host: string;
  port: number;
  remember?: boolean;
}


/**
 * Class to describe the structure of a virtual tile
 */
export class VirtualTile {
  _id: string;
  virtualName: string;
  application: string;
  tile: any;
  __v: number;
}


@Injectable()
export class UtilsService {
  constructor(public storage: Storage,
              public events: Events) {}
  /**
   * Convert a string to an attay of bytes
   */
  convertStringtoBytes = (str: String): any => {
    try {
      let dataArray = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i ++) {
        dataArray[i] = str.charCodeAt(i);
      }
      return dataArray;
    }  catch (err) {
      console.log('Converting string of data to bytes unsuccessful!');
      return null;
    }
  }

  /**
   * Returns an object with name and properties from the inputstring
   * @param {string} eventString - A string on the format eventName,properties...
   */
  getEventStringAsObject = (eventString: string): CommandObject => {
    const params = eventString.split(',');
    if (params.length > 1) {
      return new CommandObject(params[0], params.slice(1));
    }
    return null;
  }

  /**
   * Returns a string from the given commandObject
   * @param {CommansObject} cmdObj - the command to turn into a string
   */
  getCommandObjectAsString = (cmdObj: CommandObject): string => {
    return `${cmdObj.name},${cmdObj.properties.toString()}`;
  }

  /**
   * Verify that input of user login is valid
   * @param {string} user - username
   * @param {string} host - api host address
   * @param {number} port - mqtt port number
   */
  verifyLoginCredentials = (user: string, host: string, port: number): boolean => {
    const validUsername = user.match(/^[a-zA-Z0-9\_\-\.]+$/);
    const validHost = host.match(/^([0-9]{1,3}.){3}[0-9]{1,3}/) || host.match(/^[a-zA-Z0-9\_\-\.]+$/);
    return validUsername !== null && validHost !== null;
  }

  /**
   * Capitalize a string
   * @param {string} string - a string
   */
  capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export default { CommandObject, Device, UtilsService, VirtualTile };
