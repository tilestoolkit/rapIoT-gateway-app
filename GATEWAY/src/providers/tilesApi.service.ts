import { Injectable } from '@angular/core';
import { Headers, Http }    from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class TilesApi {
  defaultEventMappings = {
    btnON: {
      type: 'button_event',
      event: 'pressed',
    },
    btnOFF: {
      type: 'button_event',
      event: 'released',
    },
  };
  eventMappings = {};// {username: {tile: mappingsForTile}}
  username: string = 'TestUser';
  hostAddress: string = '178.62.99.218';//'138.68.144.206';
  mqttPort: number = 8080;
  apiPort: number = 3000;

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
            //.catch(err => alert('failed getting applications with error: ' + err));
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
  pairDeviceToVirualTile = (deviceId: string, virtualTileId: string, applicationId: string): void => {
    const url = `http://${this.hostAddress}:${this.apiPort}/applications/${applicationId}/${virtualTileId}`;
    const body = JSON.stringify({ tile: deviceId });
    const headerFields = new Headers({'Content-Type': 'application/json'});
    console.log('url: ' + url + ' body: ' + body)
    this.http.post(url, body, {headers: headerFields}).toPromise()
             .catch(err => {
               console.log('An error occured preventing the pairing of the physical and virtual tile');
             });
  };

  /**
   * Set the eventmapprings for a tile
   * @param {string} deviceId - The target tile
   * @param {any} - eventmappings to store for the tile
   *
  setEventMappings = (deviceId: string, eventMappings: any): void => {
    // TODO: Set an interface for the eventMappings 
    this.storage.set(`${this.username}_${deviceId}`, eventMappings);
  };

  /** 
   * Gets the mappings for a specific event for a tile
   * @param {string} deviceId - a tile 
   * @param {string} eventAsString - a string representation of the event
   *
  getEventMapping = (deviceId: string, eventAsString: string): any => {
    if (this.eventMappings[this.username] == null ||
        this.eventMappings[this.username][deviceId] == null) {
      this.loadEventMappings(deviceId);
    }
    return this.eventMappings[this.username][deviceId][eventAsString];
  };

  /**
   * Get the eventmappings that are stored in the apps storage
   * @param {string} deviceId - the tile to get events for
   *
  loadEventMappings = (deviceId: string): void => {
    const storedEventMappings = this.storage.get(`eventMappings_${this.username}_${deviceId}`)
                                            .then( res => res);
    this.eventMappings[this.username] = this.eventMappings[this.username] || {};
    this.eventMappings[this.username][deviceId] =
            this.utils.extendObject(this.defaultEventMappings, storedEventMappings);
  };

  /**
   * Fetch the event mappings for the given tile from the web-server
   * @param {string} deviceId - The ID of the tile
   *
  fetchEventMappings = (deviceId: string): void => {
    const url = `http://${this.hostAddress}:${this.apiPort}/eventmappings/${this.username}/${deviceId}`;
    this.http.get(url)
            .toPromise()
            .then(res => {
              const fetchedEventMappings = res.json();
              //alert('Success. Fetched data:' + JSON.stringify(res.json()));
              this.eventMappings[this.username] = this.eventMappings[this.username] || {};
              this.eventMappings[this.username][deviceId] =
                    this.utils.extendObject(this.defaultEventMappings, fetchedEventMappings);
              this.setEventMappings(deviceId, this.eventMappings[this.username][deviceId]);
            })
            .catch(err => alert('Failed fetching event mappings with error: ' + err));
  };*/
}
