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

.controller('AppRecipeCtrl', ['$scope', 'userId', 'appRecipes', function($scope, userId, appRecipes){
	var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setShowPrintMargin(false);

	$scope.user = userId;

	$scope.appRecipes = appRecipes.appRecipes;
	$scope.selectedAppRecipe = null;

	function setAsSelected(appRecipe){
		for (var i=0; i<$scope.appRecipes.length; i++){
			$scope.appRecipes[i].selected = false;
		}
		appRecipe.selected = true;
		$scope.selectedAppRecipe = appRecipe;
	}

	$scope.showAppRecipe = function(appRecipe){
		setAsSelected(appRecipe);
		var code = appRecipe.code || '';
		editor.setValue(code);
	}

	$scope.createAppRecipe = function(){
		if (!$scope.newAppRecipeName || $scope.newAppRecipeName === '') return;
		appRecipes.create(userId, $scope.newAppRecipeName);
		$scope.newAppRecipeName = '';
	}

	$scope.saveAppRecipe = function(appRecipe){
		appRecipe.code = editor.getValue();
		appRecipes.save(userId, appRecipe);
	}

	$scope.activateApp = function(appRecipe, activate){
		appRecipes.setActive(userId, appRecipe, activate);
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