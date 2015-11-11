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

	$urlRouterProvider.otherwise('users');
}]);