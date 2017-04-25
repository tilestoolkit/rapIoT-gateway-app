import { Injectable } from '@angular/core';
import { Headers, Http, Response }    from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';

import { Application, LoginData, VirtualTile } from './utils.service';


@Injectable()
export class TilesApi {
  apiPort: number = 3000;
  virtualTiles: VirtualTile[] = [];
  loginData: LoginData;
  activeApp: Application;

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
   * Sets the active app
   * @param {activeApp} activeApp - the active application
   */
  setActiveApp = (activeApp: Application): void => {
    this.activeApp = activeApp;
  }

  /**
   * Gets the active app
   */
  getActiveApp = (): Application => {
    return this.activeApp !== undefined ? this.activeApp : new Application('test3', '', '', false, false, 8080, []);
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
   * Set the virtual tiles equal to the ones stored for the app
   */
  setVirtualTiles = (): void => {
    this.getApplicationTiles().then(res => {
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

  /**
   * Checks if the user is registered on the hose server
   * @param {string} username - username to check for
   * @param {host} string - the host ip/url
   */
  isTilesUser = (userName: string, host: string): Promise<any> => {
    const url = `http://${host}:${this.apiPort}/users`;
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
  getApplicationDetails = (): Promise<any> => {
    const url = `http://${this.loginData.host}:${this.apiPort}/applications/${this.activeApp._id}`;
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
  getApplicationTiles = (): Promise<any> => {
    return this.getApplicationDetails().then(res => res.virtualTiles);
  }

  /**
   * Pair a physical tile with a virtual tile registered on the app
   * @param {string} deviceId - The physical tile
   * @param {string} virtualTileId - The virtual tile
   * @param {string} applicationId - The application the virtual tile is registered to
   */
  pairDeviceToVirualTile = (deviceId: string, virtualTileId: string): Promise<Response> => {
    const url = `http://${this.loginData.host}:${this.apiPort}/applications/${this.activeApp._id}/${virtualTileId}`;
    const body = JSON.stringify({ tile: deviceId });
    const headerFields = new Headers({'Content-Type': 'application/json'});
    console.log('url: ' + url + ' body: ' + body);
    return this.http.post(url, body, {headers: headerFields}).toPromise()
             .catch(err => {
               console.log('Feiled pairing of the physical and virtual tile with error: ' + err);
             });
  }
}
