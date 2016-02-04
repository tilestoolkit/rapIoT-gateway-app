/* Services */

angular.module('tiles.services', [])

.factory('$localstorage', ['$window', function($window) {
  return {
  	set: function(key, value) {
  		$window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
    	return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
    	$window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
    	return JSON.parse($window.localStorage[key] || '{}');
    },
    setEventMappings: function(tileId, userId, value) {
    	this.setObject('eventMappings_' + userId + '_' + tileId, value);
    },
    getEventMappings: function(tileId, userId) {
    	return this.getObject('eventMappings_' + userId + '_' + tileId);
    }
  }
}])

.factory('mqttClient', ['$rootScope', '$q', 'tilesApi', function($rootScope, $q, tilesApi){
	var o = {};

	var client;
	var publishOpts = {retain: true};
	var serverConnectionTimeout = 10000; // 10 seconds

	function getDeviceSpecificTopic(deviceId, isEvent){
        var type = isEvent ? 'evt' : 'cmd';
        return 'tiles/' + type + '/' + tilesApi.username + '/' + deviceId;
    }

	o.connect = function(host, port){
		var deferred = $q.defer();
		var failedConnectionTimeout;

		if (client) {
			// End previous server connection
			client.end();
		}

		client = mqtt.connect({
			host: host,
            port: port,
            keepalive: 0
        });

        client.on('connect', function() {
        	clearTimeout(failedConnectionTimeout);
        	deferred.resolve();
		});

		client.on('message', function(topic, message) {
	        try {
	        	var msgString = message.toString();
	            var command = JSON.parse(msgString);
	            if (command) {
	            	var deviceId = topic.split('/')[3];
	            	$rootScope.$broadcast('command', deviceId, command);
	            	$rootScope.$apply();
	            }
	        } catch (exception) {
	            console.log('JSON Parse Error: ' + exception);
	        }
		});

	    client.on('offline', function() {
	    	$rootScope.$broadcast('offline');
	    	$rootScope.$apply();
	    });

	    client.on('close', function() {
	    	$rootScope.$broadcast('close');
	    	$rootScope.$apply();
	    });

	    client.on('reconnect', function() {
	    	$rootScope.$broadcast('reconnect');
	    	$rootScope.$apply();
	    });

	    client.on('error', function(error) {
	    	$rootScope.$broadcast('error', error);
	    	$rootScope.$apply();
	    });

	    failedConnectionTimeout = setTimeout(function(){
    		client.end();
    		deferred.reject();
	    }, serverConnectionTimeout);

	    return deferred.promise;
	}

	/*o.publish = function(topic, payload, options){
		if (client) client.publish(topic, payload, options);
	}

	o.subscribe = function(topic){
		if (client) client.subscribe(topic);
	}

	o.unsubscribe = function(topic){
		if (client) client.unsubscribe(topic);
	}*/

	o.registerDevice = function(deviceId){
		if (client) {
            client.publish(getDeviceSpecificTopic(deviceId, true) + '/active', 'true', publishOpts);
            client.subscribe(getDeviceSpecificTopic(deviceId, false));
        }
	}

	o.unregisterDevice = function(deviceId){
		if (client) {
            client.publish(getDeviceSpecificTopic(deviceId, true) + '/active', 'false', publishOpts);
            client.unsubscribe(getDeviceSpecificTopic(deviceId, false));
        }
	}

	o.sendEvent = function(deviceId, event){
		if (client) client.publish(getDeviceSpecificTopic(deviceId, true), JSON.stringify(event), publishOpts);
	}

	o.endConnection = function(deviceId, event){
		if (client) client.end();
	}

	return o;
}])

.factory('tilesApi', ['$http', '$localstorage', function($http, $localstorage){
	var o = {
		username: $localstorage.get('username', 'TestUser'),
		host: {
			address: $localstorage.get('hostAddress', '192.168.1.2'),
			mqttPort: $localstorage.get('mqttPort', 8080),
			apiPort: 3000
		}
	};

	var defaultEventMappings = {
		btnON: {
		    type: 'button_event',
		    event: 'pressed'
	    },
	    btnOFF: {
		    type: 'button_event',
		    event: 'released'
	    }
	}

	var eventMappings = {};

	function extend(obj1, obj2){
    	var extended = {};
    	for (var attrname in obj1) { extended[attrname] = obj1[attrname]; }
    	for (var attrname in obj2) { extended[attrname] = obj2[attrname]; }
    	return extended;
	}

	o.setUsername = function(username){
		o.username = username;
		$localstorage.set('username', username);
	}

	o.setHostAddress = function(hostAddress){
		o.host.address = hostAddress;
		$localstorage.set('hostAddress', hostAddress);
	}

	o.setHostMqttPort = function(hostMqttPort){
		o.host.mqttPort = hostMqttPort;
		$localstorage.set('hostMqttPort', hostMqttPort);
	}

	o.getEventMapping = function(tileId, eventAsString) {
		if (eventMappings[o.username] == null || eventMappings[o.username][tileId] == null) {
			o.loadEventMappings(tileId);
		}
		return eventMappings[o.username][tileId][eventAsString];
	}

	o.loadEventMappings = function(tileId) {
		var storedEventMappings = $localstorage.getEventMappings(tileId, o.username);
		if (eventMappings[o.username] == null) eventMappings[o.username] = {};
		eventMappings[o.username][tileId] = extend(defaultEventMappings, storedEventMappings);
	}

	o.fetchEventMappings = function(tileId, successCb) {
		var url = 'http://' + o.host.address + ':' + o.host.apiPort + '/eventmappings/' + o.username + '/' + tileId;
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
	}

	return o;
}]);