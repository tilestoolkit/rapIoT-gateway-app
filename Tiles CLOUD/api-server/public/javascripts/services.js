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

	o.create = function(user) {
  		return $http.post('/users', user).success(function(data){
	    	o.users.push(data);
  		});
	}

	o.addTile = function(user, tileDeviceId) {
  		return $http.post('/users/'+user._id + '/tiles', {deviceId: tileDeviceId}).success(function(){
	    	user.tiles.push(tileDeviceId)
  		});
	}

	return o;
}]);