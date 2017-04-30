import { Injectable } from '@angular/core';
import { Headers, Http, Response }    from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';

import { Application, LoginData, VirtualTile } from './utils.service';


@Injectable()
export class TilesApi {
  public activeApp: Application;
  public apiPort: number = 3000;
  public virtualTiles: VirtualTile[] = [];
  public loginData: LoginData;

  constructor(public http: Http,
              public storage: Storage) {
  }

  /**
   * The following code will mainly be used for getting private parameters
   * for testing purposes
   */
  public getHttp = (): Http => {
    return this.http;
  }
  public getStorage = (): Storage => {
    return this.storage;
  }

  /**
   * Tests if a device is a tile
   * @param {any} device - the device to test
   */
  public isTilesDevice = (device: any): boolean => {
    return device.name != null && device.name.substring(0, 4) === 'Tile';
  }

  /**
   * Sets login data for the user
   * @param {LoginData} loginData - the loginData
   */
  public setLoginData = (loginData: LoginData): void => {
    this.loginData = loginData;
  }

  /**
   * Gets login data for the user
   */
  public getLoginData = (): LoginData => {
    if (this.loginData === undefined || this.loginData === null) {
      this.storage.get('loginData').then(loginData => {
        this.setLoginData(loginData);
        return loginData;
      });
    } else {
      return this.loginData;
    }
  }

  /**
   * Sets the active app
   * @param {activeApp} activeApp - the active application
   */
  public setActiveApp = (activeApp: Application): void => {
    this.activeApp = activeApp;
  }

  /**
   * Gets the active app
   */
  public getActiveApp = (): Application => {
    return this.activeApp !== undefined ? this.activeApp : new Application('test3', '', '', false, false, 8080, []);
  }

  /**
   * Set the virtual tiles equal to the ones stored for the app
   */
  public setVirtualTiles = (): void => {
    this.getApplicationTiles().then(res => {
      this.virtualTiles = res;
    });
  }

  /**
   * Get the virtual tiles
   */
  public getVirtualTiles = (): VirtualTile[] => {
    return this.virtualTiles;
  }

  /**
   * Set the virtual tiles list to empty
   */
  public clearVirtualTiles = (): void => {
    this.virtualTiles = [];
  }

  /**
   * Checks if the user is registered on the hose server
   * @param {string} username - username to check for
   * @param {host} string - the host ip/url
   */
  public isTilesUser = (userName: string, host: string): Promise<any> => {
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
  public getAllApplications = (): Promise<any> => {
    const url = `http://${this.loginData.host}:${this.apiPort}/applications`;
    return this.http.get(url)
            .toPromise()
            .then(res => {
              return res.json();
            })
            .catch(err => {
              console.log('failed getting applications with error: ' + err);
              return null;
            });
  }

  /**
   * Get the details of an application
   * @param {string} applicationId - The application ID
   */
  public getApplicationDetails = (): Promise<any> => {
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
  public getApplicationTiles = (): Promise<any> => {
    return this.getApplicationDetails().then(res => res.virtualTiles);
  }

  /**
   * Pair a physical tile with a virtual tile registered on the app
   * @param {string} deviceId - The physical tile
   * @param {string} virtualTileId - The virtual tile
   * @param {string} applicationId - The application the virtual tile is registered to
   */
  public pairDeviceToVirualTile = (deviceId: string, virtualTileId: string): Promise<Response> => {
    const url = `http://${this.loginData.host}:${this.apiPort}/applications/${this.activeApp._id}/${virtualTileId}`;
    const body = JSON.stringify({ tile: deviceId });
    const headerFields = new Headers({'Content-Type': 'application/json'});
    console.log('url: ' + url + ' body: ' + body);
    return this.http.post(url, body, {headers: headerFields}).toPromise()
             .catch(err => {
               console.log('Feiled pairing of the physical and virtual tile with error: ' + err);
               return null;
             });
  }
}
