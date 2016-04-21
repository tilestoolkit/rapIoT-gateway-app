/* Main module */

angular.module('tilesApi', ['ui.router', 'tilesApi.controllers', 'tilesApi.services'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('users', {
			url: '/users',
			templateUrl: '/users.html',
			controller: 'UsersCtrl',
			resolve: {
				userPromise: ['users', function(users){
					return users.getAll();
				}]
			}
		})
		.state('user', {
			url: '/users/{id}',
			templateUrl: '/user.html',
			controller: 'UserCtrl',
			resolve: {
				user: ['$stateParams', 'users', function($stateParams, users) {
  					return users.get($stateParams.id);
				}]
			}
		})
		.state('tiles', {
			url: '/users/{userId}/{tileId}',
			templateUrl: '/tile.html',
			controller: 'TileCtrl',
			resolve: {
				userId: ['$stateParams', function($stateParams) {
  					return $stateParams.userId;
				}],
				tileId: ['$stateParams', function($stateParams) {
  					return $stateParams.tileId;
				}],
				tile: ['$stateParams', 'tiles', function($stateParams, tiles) {
  					return tiles.get($stateParams.userId, $stateParams.tileId);
				}],
				registeredWebhooksPromise: ['$stateParams', 'webhooks', function($stateParams, webhooks) {
  					return webhooks.getRegistered($stateParams.userId, $stateParams.tileId);
				}]
			}
		});

	$urlRouterProvider.otherwise('users');
}]);