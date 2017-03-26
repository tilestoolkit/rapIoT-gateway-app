import { Injectable } from '@angular/core';
import { Headers, Http, Response }    from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';

import { Application, VirtualTile } from './utils.service';


@Injectable()
export class TilesApi {
  apiPort: number = 3000;
  virtualTiles: VirtualTile[] = [];

  constructor(private http: Http,
              private storage: Storage) {
  }

  /** 
   * Tests if a device is a tile
   * @param {any} device - the device to test
   */
  isTilesDevice = (device: any): boolean => {
    return device.name != null && device.name.substring(0, 4) === 'Tile';
  };

  /** 
   * Set a username for the tile owner/user
   * @param {string} username - The new username
   */
  setUsername = (username: string): void => {
    this.username = username;
  };

  /** 
   * Set the host address
   * @param {string} hostAddress - The url/ip address of the host
   */
  setHostAddress = (hostAddress: string): void => {
    this.hostAddress = hostAddress;
  };

  /** 
   * Set the port for connecting to the server
   * @param {number} hostMqttPort - the port number 
   */
  setHostMqttPort = (hostMqttPort: number): void => {
    this.mqttPort = hostMqttPort;
  };

  /**
   * Set the virtual tiles equal to the ones stores for the app
   */
  setVirtualTiles = (appId: string): void => {
    this.getApplicationTiles(appId).then(res => {
      this.virtualTiles = res;
    });
  };

  /**
   * Get the virtual tiles
   */
  getVirtualTiles = (): VirtualTile[] => {
    return this.virtualTiles;
  };

  /** 
   * Get all registered applications for all users
   */
  getAllApplications = (): Promise<any> => {
    const url = `http://${this.hostAddress}:${this.apiPort}/applications`;
    console.log(url)
    return this.http.get(url)
            .toPromise()
            .then(res => {
              return res.json();
            })
            .catch(err => {
              //alert('failed getting applications with error: ' + err);
            });
  };

  /** 
   * Get the details of an application
   * @param {string} applicationId - The application ID
   */
  getApplicationDetails = (applicationId: string): Promise<any> => {
    //const url = `http://${this.hostAddress}:${this.apiPort}/applications/${applicationId}`;
    const url = `http://${this.hostAddress}:${this.apiPort}/applications/${applicationId}`;
    return this.http.get(url)
            .toPromise()
            .then(res => {
              return res.json();
            })
            .catch(err => {
              console.log('failed getting applications with error: ' + err);
              console.log('url '+url)
              return null;
            });
  };

  /** 
   * Get the tiles belonging to an application
   * @param {string} applicationId - The application ID
   */
  getApplicationTiles = (applicationId: string): Promise<any> => {
    return this.getApplicationDetails(applicationId).then(res => res.virtualTiles);
  };

  /**
   * Pair a physical tile with a virtual tile registered on the app
   * @param {string} deviceId - The physical tile
   * @param {string} virtualTileId - The virtual tile
   * @param {string} applicationId - The application the virtual tile is registered to
   */
  pairDeviceToVirualTile = (deviceId: string, virtualTileId: string, applicationId: string): Promise<Response> => {
    const url = `http://${this.hostAddress}:${this.apiPort}/applications/${applicationId}/${virtualTileId}`;
    const body = JSON.stringify({ tile: deviceId });
    const headerFields = new Headers({'Content-Type': 'application/json'});
    console.log('url: ' + url + ' body: ' + body)
    return this.http.post(url, body, {headers: headerFields}).toPromise()
             .catch(err => {
               console.log('An error occured preventing the pairing of the physical and virtual tile');
             });
  };
}
