/*
* Cross-Communication Example
* Requires minimum two Tiles connected to 'TestUser'.
* When the button on one of the Tiles is being pressed, all the other connected Tiles' lights will be activated.
*/
var TilesClient = require('../../');

var client = new TilesClient('TestUser','test.mosquitto.org','1883').connect();

var registeredTiles = [];

client.on('connect', function(){
	console.log('Connected!');
});

client.on('receive', function(tileId, data){
	console.log('Message received from ' + tileId + ': ' + data);
	try {
		var json = JSON.parse(data);
		if (json && json.type === 'button_event') {
			var activation = (json.event === 'pressed') ? 'on' : 'off';
			var length = registeredTiles.length;
			for (var i = 0; i < length; i++) {
				if (registeredTiles[i] === tileId) continue; // Don't send to self
		    	client.send(registeredTiles[i], '{"activation": "' + activation + '"}');
			}
		}
	} catch (error) {
		console.log('Error: ' + error);
	}
});

client.on('tileRegistered', function(tileId){
	console.log('Tile registered: ' + tileId);
	registeredTiles.push(tileId);
});

client.on('tileUnregistered', function(tileId){
	console.log('Tile unregistered: ' + tileId);
	var index = registeredTiles.indexOf(tileId);
	if (index > -1) {
    	registeredTiles.splice(index, 1);
	}
});
