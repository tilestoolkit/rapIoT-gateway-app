/* Services */

angular.module('tilesApi.services', [])

.factory('users', ['$http', function($http){
	var o = {
		users: []
	}

	o.getAll = function() {
		return $http.get('/users').success(function(data){
			angular.copy(data, o.users);
		})
	}

	o.get = function(id) {
  		return $http.get('/users/' + id).then(function(res){
    		return res.data;
  		});
	}

	o.create = function(username) {
  		return $http.post('/users', {_id: username}).success(function(data){
	    	o.users.push(data);
  		});
	}

	o.addTile = function(user, tileDeviceId) {
		return $http.post('/tiles', {tileId: tileDeviceId, userId: user._id}).success(function(data){
	    	user.tiles.push(data)
  		});
	}

	o.removeTile = function(user, tile) {
  		return $http.delete('/users/' + user._id + '/tiles/' + tile._id).then(function(res){
			var index = user.tiles.indexOf(tile);
			user.tiles.splice(index, 1);
		});
	}

	return o;
}])

.factory('tiles', ['$http', function($http){
	var o = { };

	o.get = function(userId, tileId) {
  		return $http.get('/users/' + userId + '/tiles/' + tileId).then(function(res){
    		return res.data;
  		});
	}

	return o;
}])

.factory('webhooks', ['$http', function($http){
	var o = {
		webhooks: []
	};

	o.getRegistered = function(userId, tileId) {
		return $http.get('/webhooks/' + userId + '/' + tileId).then(function(res){
    		angular.copy(res.data, o.webhooks);
  		});
	}

	o.add = function(userId, tileId, postUrl) {
		return $http.post('/webhooks/' + userId + '/' + tileId, '{"postUrl": "' + postUrl + '"}').then(function(res){
	    	o.webhooks.push(res.data);
  		});
	}

	o.delete = function(webhook) {
		return $http.delete('/webhooks/' + webhook.user + '/' + webhook.tile + '/' + webhook._id).then(function(res){
			var index = o.webhooks.indexOf(webhook);
			o.webhooks.splice(index, 1);
		});
	}

	return o;
}]);