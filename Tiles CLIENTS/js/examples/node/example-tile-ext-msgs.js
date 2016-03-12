/*
* Example: Message format supporting extensibility
*/
var TilesClient = require('../../');

var client = new TilesClient('TestUser', 'test.mosquitto.org', 1883).connect();

client.on('connect', function(){
	console.log('Connected!');
});

client.on('receive', function(tileId, event){
	console.log('Message received from ' + tileId + ': ' + JSON.stringify(event));
	client.send(client.tiles['TILES3'], 'led', 'blink', 'red');
});

client.on('tileRegistered', function(tileId){
	console.log('Tile registered: ' + tileId);
});

client.on('tileUnregistered', function(tileId){
	console.log('Tile unregistered: ' + tileId);
});
