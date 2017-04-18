import { Injectable } from '@angular/core';
import { Headers, Http, Response }    from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';

import { LoginData, VirtualTile } from './utils.service';


@Injectable()
export class TilesApi {
  apiPort: number = 3000;
  virtualTiles: VirtualTile[] = [];
  loginData: LoginData;

  constructor(private http: Http,
              private storage: Storage) {
  }

  /**
   * Tests if a device is a tile
   * @param {any} device - the device to test
   */
  isTilesDevice = (device: any): boolean => {
    return device.name != null && device.name.substring(0, 4) === 'Tile';
  }

  /**
   * Sets login data for the user
   * @param {LoginData} loginData - the device to test
   */
  setLoginData = (loginData: LoginData): void => {
    this.loginData = loginData;
  }

  /**
   * Gets login data for the user
   */
  getLoginData = (): LoginData => {
    if (this.loginData === undefined || this.loginData === null) {
      this.storage.get('loginData').then((loginData) => {
        this.setLoginData(loginData);
        return loginData;
      });
    } else {
      return this.loginData;
    }
  }

  /**
   * Set the virtual tiles equal to the ones stores for the app
   */
  setVirtualTiles = (appId: string): void => {
    this.getApplicationTiles(appId).then(res => {
      this.virtualTiles = res;
    });
  }

  /**
   * Get the virtual tiles
   */
  getVirtualTiles = (): VirtualTile[] => {
    return this.virtualTiles;
  }

  /**
   * Set the virtual tiles list to empty
   */
  clearVirtualTiles = (): void => {
    this.virtualTiles = [];
  }

  
  getAllUsers = (userName: string, host: string, port: number): Promise<any> => {
    const url = `http://${host}:${port}/users`;
    return this.http.get(url)
            .toPromise()
            .then(res => {
              for (let user of res.json()) {
                if (user._id === userName) {
                  return true;
                }
              }
            })
            .catch(err => {
               return false;
              // alert('failed getting applications with error: ' + err);
            });
  }

  /**
   * Get all registered applications for all users
   */
  getAllApplications = (): Promise<any> => {
    const url = `http://${this.loginData.host}:${this.apiPort}/applications`;
    console.log(url);
    return this.http.get(url)
            .toPromise()
            .then(res => {
              return res.json();
            })
            .catch(err => {
              console.log('failed getting applications with error: ' + err);
            });
  }

  /**
   * Get the details of an application
   * @param {string} applicationId - The application ID
   */
  getApplicationDetails = (applicationId: string): Promise<any> => {
    const url = `http://${this.loginData.host}:${this.apiPort}/applications/${applicationId}`;
    return this.http.get(url)
            .toPromise()
            .then(res => {
              return res.json();
            })
            .catch(err => {
              console.log('failed getting applications with error: ' + err);
              console.log('url ' + url);
              return null;
            });
  }

  /**
   * Get the tiles belonging to an application
   * @param {string} applicationId - The application ID
   */
  getApplicationTiles = (applicationId: string): Promise<any> => {
    return this.getApplicationDetails(applicationId).then(res => res.virtualTiles);
  }

  /**
   * Pair a physical tile with a virtual tile registered on the app
   * @param {string} deviceId - The physical tile
   * @param {string} virtualTileId - The virtual tile
   * @param {string} applicationId - The application the virtual tile is registered to
   */
  pairDeviceToVirualTile = (deviceId: string, virtualTileId: string, applicationId: string): Promise<Response> => {
    const url = `http://${this.loginData.host}:${this.apiPort}/applications/${applicationId}/${virtualTileId}`;
    const body = JSON.stringify({ tile: deviceId });
    const headerFields = new Headers({'Content-Type': 'application/json'});
    console.log('url: ' + url + ' body: ' + body);
    return this.http.post(url, body, {headers: headerFields}).toPromise()
             .catch(err => {
               console.log('Feiled pairing of the physical and virtual tile with error: ' + err);
             });
  }
}
