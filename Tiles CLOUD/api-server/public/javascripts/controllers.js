/* Controllers */

angular.module('tilesApi.controllers', [])

.controller('UsersCtrl', ['$scope', 'users', function($scope, users){
	$scope.users = users.users;

	$scope.addUser = function(){
		if(!$scope.username || $scope.username === '') return;
		users.create($scope.username);
		$scope.title = '';
		$scope.link = '';
	}
}])

.controller('UserCtrl', ['$scope', 'users', 'user', function($scope, users, user){
	$scope.user = user;
	$scope.tiles = user.tiles;

	$scope.addTile = function(){
		if(!$scope.tileDeviceId || $scope.tileDeviceId === '') return;
		users.addTile(user, $scope.tileDeviceId);
		$scope.tileDeviceId = '';
	}

	$scope.removeTile = function(tile){
		users.removeTile(user, tile);
	}
}])

.controller('TileCtrl', ['$scope', 'userId', 'tile', 'tileId', 'webhooks', function($scope, userId, tile, tileId, webhooks){
	$scope.userId = userId;
	$scope.tileId = tileId;
	$scope.tileName = tile.name;
	$scope.webhooks = webhooks.webhooks;

	$scope.addWebhook = function(){
		if(!$scope.webhookUrl || $scope.webhookUrl === '') return;
		webhooks.add(userId, tileId, $scope.webhookUrl);
		$scope.webhookUrl = '';
	}

	$scope.deleteWebhook = function(webhook){
		webhooks.delete(webhook);
	}
}]);