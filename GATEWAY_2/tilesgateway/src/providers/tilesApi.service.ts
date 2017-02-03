import { Injectable } from '@angular/core';

@Injectable()
export class tilesApi {
	//TODO: get the data from the angular2 alternative to localstorage when it is made
	username: string;
	host: any;
	//hostAddress: string;
	//mqttPort: int | string;

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

	constructor(username: string = 'TestUser', 
							hostAddress: string = 'cloud.tilestoolkit.io', 
							mqttPort: number | string = 8080) {
		this.username = username;
		this.host.Address = hostAddress;
		this.host.mqttPort = mqttPort;
	}
	
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
    this.host.address = hostAddress;
    //$localstorage.set('hostAddress', hostAddress);
  };

  setHostMqttPort = (hostMqttPort) => {
    this.host.mqttPort = hostMqttPort;
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

/*
  fetchEventMappings = (tileId, successCb) => {
   const url = 'http://' + this.host.address + ':' + this.host.apiPort + '/eventmappings/' + this.username + '/' + tileId;
    return $http.get(url).then(function(resp) {
      var fetchedEventMappings = resp.data;
      console.log('Success. Fetched data:' + JSON.stringify(fetchedEventMappings));
      
      $localstorage.setEventMappings(tileId, o.username, fetchedEventMappings);
      if (eventMappings[o.username] == null) eventMappings[o.username] = {};
      eventMappings[o.username][tileId] = extend(defaultEventMappings, fetchedEventMappings);

      if (successCb) successCb(fetchedEventMappings);
    }, function(err) {
      console.error('Error', JSON.stringify(err));
    });

*/


}