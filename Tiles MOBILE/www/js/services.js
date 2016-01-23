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
		    type: 'buttonEvent',
		    event: 'pressed'
	    },
	    btnOFF: {
		    type: 'buttonEvent',
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