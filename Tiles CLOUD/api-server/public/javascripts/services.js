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

.factory('appRecipes', ['$http', function($http){
	var o = {
		appRecipes: []
	};

	var escape = function (str) {
  		return str
    	.replace(/[\\]/g, '\\\\')
    	.replace(/[\"]/g, '\\\"')
    	.replace(/[\/]/g, '\\/')
    	.replace(/[\b]/g, '\\b')
    	.replace(/[\f]/g, '\\f')
    	.replace(/[\n]/g, '\\n')
    	.replace(/[\r]/g, '\\r')
    	.replace(/[\t]/g, '\\t');
	};


	o.getAll = function(userId) {
  		return $http.get('/appRecipes/' + userId).then(function(res){
  			angular.copy(res.data, o.appRecipes);
  		});
	}

	o.create = function(userId, name) {
  		return $http.post('/appRecipes/' + userId, '{"name": "' + name + '"}').then(function(res){
    		o.appRecipes.push(res.data);
  		});
	}

	o.get = function(userId, appRecipe) {
  		return $http.get('/appRecipes/' + userId + '/' + appRecipe._id).then(function(res){
  			return res.data;
  		});
	}

	o.save = function(userId, appRecipe) {
		return $http.put('/appRecipes/' + userId + '/' + appRecipe._id, '{"code": "' + escape(appRecipe.code) + '"}').then(function(res){
			console.log('Saved successfully! Data: ' + JSON.stringify(res.data));
		});
	}

	o.delete = function(userId, appRecipe) {
		return $http.delete('/appRecipes/' + userId + '/' + appRecipe._id).then(function(res){
			var index = o.appRecipes.indexOf(appRecipes);
			o.appRecipes.splice(index, 1);
		});
	}

	o.setActive = function(userId, appRecipe, active) {
		return $http.put('/appRecipes/' + userId + '/' + appRecipe._id + '/active', '{"active": ' + active + '}').then(function(res){
			appRecipe.active = active;
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