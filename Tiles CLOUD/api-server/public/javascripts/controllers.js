/* Controllers */

angular.module('tilesApi.controllers', [])

.controller('UsersCtrl', ['$scope', 'users', function($scope, users){
	$scope.users = users.users;

	$scope.addUser = function(){
		if(!$scope.username || $scope.username === '') return;
		users.create({username: $scope.username});
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
}]);