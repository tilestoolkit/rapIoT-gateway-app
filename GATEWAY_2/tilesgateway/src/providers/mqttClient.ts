import { Injectable } from '@angular/core';
import 'mqtt';


@Injectable()
export class mqttClient {
  o = {};
  publishOpts = { retain: true };
  serverConnectionTimeout = 10000; // 10 seconds

  constructor() {}

  /* Returns a url for the specific device
	 * @param deviceId: String
	 * @param isEvent: Boolean
   */
  getDeviceSpecificTopic(deviceId, isEvent): String {
  	type = isEvent ? 'evt' : 'cmd';
  	return 'tiles/' + type + '/' + tilesApi.username + '/' + deviceId;
  }


  /* Create a connection to the server and
   * return a javascript promise 
   */
  o.connect = (host, port) => {
  	return new Observable( observer => {

  		// Check if a previous server connection exists
  		// and end it if it does
  		if (client) {
  			client.end();
  		}

  		
  		// Instantiate a mqtt-client from the host and port
  		// keepalive 0 disables keepalive
  		// NB: In angular1 code the client was instantiated outside of o
  		// that might be nescessary here as well
  		const client = mqtt.connect({
	  			host: host, 
	  			port: port,
  			}, 
				keepalive: 0 
			);


  		// Handlers for different types of responses from the server: 

  		// Client is connected to the server
  		client.on('connect', () => {
  			clearTimeout(failedConnectionTimeout);
  			observer.complete();
  		});

  		// Handle a message from the server
  		client.on('message', (topic, message) => {
  			console.log('Received message from server: ' + message);
  			try {
  				const command = JSON.parse(message);
  				if (command) {
  					const deviceId = topic.split('/')[3];
  					/* TODO: Find a way to get the functionallity of 
						 * $rootScope.$broadcast() and
						 * $rootScope.$apply()
						 * from angular 1. This link might be the solution: 
						 * https://laco0416.github.io/post/event-broadcasting-in-angular-2/
						 */
  				}
  			}
  		});


  		client.on('offline', () => {
	      //$rootScope.$broadcast('offline');
	      //$rootScope.$apply();
	    });

	    client.on('close', () => {
	      //$rootScope.$broadcast('close');
	      //$rootScope.$apply();
	    });

	    client.on('reconnect', () => {
	      //$rootScope.$broadcast('reconnect');
	      //$rootScope.$apply();
	    });

	    client.on('error', error => {
	      //$rootScope.$broadcast('error', error);
	      //$rootScope.$apply();
	    });


  	});
  };

	// The fact that the other functions are using client might be why it was instantiated globally
	o.registerDevice = device => {
		if (client) {
			client.publish(getDeviceSpecificTopic(device.id, true) + '/active', 'true', publishOpts);
      client.publish(getDeviceSpecificTopic(device.id, true) + '/name', device.name, publishOpts);
      client.subscribe(getDeviceSpecificTopic(device.id, false));
      console.log('Registered device: ' + device.name + ' (' + device.id + ')');
  	};
	};

  o.unregisterDevice = device => {
    if (client) {
      client.publish(getDeviceSpecificTopic(device.id, true) + '/active', 'false', publishOpts);
      client.unsubscribe(getDeviceSpecificTopic(device.id, false));
    };
  };

  o.sendEvent = (deviceId, event) => {
    if (client) {
    	client.publish(getDeviceSpecificTopic(deviceId, true), JSON.stringify(event), publishOpts)
    };
  };

  o.endConnection = (deviceId, event) => {
    if (client) {
    	client.end()
    };
  };

  return o;

}