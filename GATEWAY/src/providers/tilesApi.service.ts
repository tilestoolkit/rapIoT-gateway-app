import { Injectable } from '@angular/core';
import { Headers, Http }    from '@angular/http';
import { Storage } from '@ionic/storage';
import { Alert, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';

import { Application, LoginData, VirtualTile } from './utils.service';


@Injectable()
export class TilesApi {
  public activeApp: Application;
  public apiPort: number = 3000;
  public virtualTiles: VirtualTile[] = [];
  public loginData: LoginData;
  public errorAlert: Alert;
  public hostUrl: string;
  private headerFields: Headers;

  constructor(private alertCtrl: AlertController,
              public http: Http,
              public storage: Storage) {
    this.headerFields = new Headers({'Content-Type': 'application/json'});
    this.errorAlert = this.alertCtrl.create({
      buttons: [{
        text: 'Dismiss',
      }],
      enableBackdropDismiss: true,
      subTitle: 'Make sure you have internet connection and that you ' +
                'have provided the correct host address when logging ' +
                'in. If it still won\'t work the error might be on the ' +
                'host. Try again later or contact the host owners.',
      title: 'Could not get data from remote source',
    });
  }

  /**
   * Test if a device is a tile
   * @param {any} device - the device to test
   */
  public isTilesDevice = (device: any): boolean => {
    return device.name != null && device.name.substring(0, 4) === 'Tile';
  }

  /**
   * Set login information for the user
   * @param {LoginData} loginData - the loginData
   */
  public setLoginData = (loginData: LoginData): void => {
    this.loginData = loginData;
    this.hostUrl = `http://${loginData.host}:${this.apiPort}`;
  }

  /**
   * Get login data for the user
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
   * Set the active app
   * @param {activeApp} activeApp - the active application
   */
  public setActiveApp = (activeApp: Application): void => {
    this.activeApp = activeApp;
  }

  /**
   * Get the active app
   */
  public getActiveApp = (): Application => {
    if (this.activeApp === undefined || this.activeApp === null) {
      return new Application('', '', '', false, false, 8080, []);
    }
    return this.activeApp;
  }

  /**
   * Set the virtual tiles equal to the ones stored for the current application
   */
  public setVirtualTiles = (): Promise<any> => {
    return this.getApplicationTiles().then(res => {
      this.virtualTiles = res;
      return res;
    }).catch(err => err);
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
   * Check if the user is registered on the host server
   * @param {string} username - username
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
            .catch(err => false);
  }

  /**
   * Get all registered applications for the current
   */
  public getAllApplications = (): Promise<any> => {
    const url = `${this.hostUrl}/applications/user/${this.loginData.user}`;
    return this.http.get(url)
            .toPromise()
            .then(res => {
              return res.json();
            })
            .catch(err => this.errorAlert.present());
  }

  /**
   * Get the entire json object representing the active application
   */
  public getApplicationDetails = (): Promise<any> => {
    const url = `${this.hostUrl}/applications/${this.activeApp._id}`;
    return this.http.get(url)
            .toPromise()
            .then(res => {
              return res.json();
            })
            .catch(err => this.errorAlert.present());
  }

  /**
   * Get all the virtual tiles belonging to an application
   */
  public getApplicationTiles = (): Promise<any> => {
    return this.getApplicationDetails().then(res => res.virtualTiles);
  }

  /**
   * Pair a physical tile to a virtual tile registered on the app
   * @param {string} deviceId - The physical tile
   * @param {string} virtualTileId - The virtual tile
   * @param {string} applicationId - The application the virtual tile is registered to
   */
  public pairDeviceToVirualTile = (deviceId: string, virtualTileId: string): Promise<void> => {
    const url = `${this.hostUrl}/applications/${this.activeApp._id}/${virtualTileId}`;
    const body = JSON.stringify({ tile: deviceId });
    return this.http.post(url, body, {headers: this.headerFields}).toPromise()
               .then(res => {
                 // The server will return null if the tile is not stored in the database. If so
                 // we need to add it to the database and try again to pair it.
                 if (res === null) {
                   this.addTileToDatabase(deviceId).then(addRes => {
                     if (addRes === true) {
                       this.pairDeviceToVirualTile(deviceId, virtualTileId);
                     } else {
                       this.errorAlert.present();
                     }
                   });
                 }
               })
               .catch(err => this.errorAlert.present());
  }

  /**
   * Add a tile to the database to make it possible to pair it to a virtual tile
   * @param {string} deviceId - The physical tile
   */
  public addTileToDatabase = (deviceId: string): Promise<boolean> => {
    const url = `${this.hostUrl}/tiles`;
    const body = JSON.stringify({ tileId: deviceId, userId: this.loginData.user, name: deviceId });
    return this.http.post(url, body, {headers: this.headerFields}).toPromise()
               .then(res => true)
               .catch(err => false);
  }

  /**
   * Toggle the appOnline for the application on/off. Return the application with
   * changes if get call was successfull, otherwise the application as was.
   * @param {Application} application - The application
   */
  public toggleAppOnline = (application: Application): Promise<Application> => {
    const url = `http://${this.loginData.host}:${this.apiPort}/applications/${application._id}/host/app`;
    const headerFields = new Headers({'Content-Type': 'application/json'});
    return this.http.get(url, {headers: headerFields}).toPromise()
               .then(res => {
                 application.appOnline = res.json().appOnline;
                 return application;
               })
               .catch(err => application);
  }
}
