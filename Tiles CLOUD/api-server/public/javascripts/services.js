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
}]);