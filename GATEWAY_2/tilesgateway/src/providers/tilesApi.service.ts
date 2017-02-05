import { Injectable } from '@angular/core';
import { Http }    from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TilesApi {

  // Make this a global? 
  defaultEventMappings = {
    btnON: {
      type: 'button_event',
      event: 'pressed'
    },
    btnOFF: {
      type: 'button_event',
      event: 'released'
    }
  };

  eventMappings = {};

	constructor(public username: string = 'TestUser', 
							public hostAddress: string = 'cloud.tilestoolkit.io', 
							public mqttPort: number | string = 8080,
							public storage: Storage,
							private http: Http) { 
	};
	
	// Returns an object with name and properties from the inputstring
  getEventStringAsObject = (evtString: string) => {
    const params = evtString.split(',');
    return {
      name: params[0],
      properties: Array.prototype.slice.call(params, 1)
    };
  };

  // Turn the eventobject into a string
  getCommandObjectAsString = cmdObj => {
    return cmdObj.name + ',' + cmdObj.properties.toString();
  };

  // Create a new object that has all the attributes from both inputobjects
  extend = (obj1, obj2) => {
    let extended = {};
    // TODO: if any attr has the same name obj 2 will overwrite obj1
    for (var attrname in obj1) { extended[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { extended[attrname] = obj2[attrname]; }
    return extended;
  }


  setUsername = (username: string) => {
    this.username = username;
    //$localstorage.set('username', username);
  };

  setHostAddress = (hostAddress: string) => {
    this.hostAddress = hostAddress;
    //$localstorage.set('hostAddress', hostAddress);
  };

  setHostMqttPort = (hostMqttPort) => {
    this.mqttPort = hostMqttPort;
    //$localstorage.set('hostMqttPort', hostMqttPort);
  };

  getEventMapping = (tileId, eventAsString) => {
    if (this.eventMappings[this.username] == null || this.eventMappings[this.username][tileId] == null) {
      this.loadEventMappings(tileId);
    }
    return this.eventMappings[this.username][tileId][eventAsString];
  };

  loadEventMappings = (tileId) => {
  	// TODO: 
    const storedEventMappings = {} //$localstorage.getEventMappings(tileId, o.username);
    if (this.eventMappings[this.username] == null) this.eventMappings[this.username] = {};
    this.eventMappings[this.username][tileId] = this.extend(this.defaultEventMappings, storedEventMappings);
  };


  fetchEventMappings = (tileId, successCb) => {
   const url = 'http://' + this.hostAddress + ':' + this.mqttPort + '/eventmappings/' + this.username + '/' + tileId;
    return this.http.get(url)
					     .toPromise()
					   	 .then((res) => {
						      const fetchedEventMappings = JSON.stringify(res.json().data);
						      console.log('Success. Fetched data:' + fetchedEventMappings);
						      
						      this.storage.set('eventMappings_' + this.username + '_' + tileId, fetchedEventMappings);
						      if (this.eventMappings[this.username] == null) {
						      	this.eventMappings[this.username] = {};
						      };

						      this.eventMappings[this.username][tileId] = this.extend(this.defaultEventMappings, res.json().data);

						      if (successCb) successCb(res.json().data);
						   })
						   .catch((err) => (console.error('Error', JSON.stringify(err))));
  };
};