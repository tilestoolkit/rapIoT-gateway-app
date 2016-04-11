/*
* Example: Get Tile by name
*/
var TilesClient = require('../../');

var client = new TilesClient('TestUser', 'localhost', 1883).connect();

client.on('connect', function(){
	console.log('Connected!');
});

client.on('receive', function(tileId, event){
	console.log('Message received from ' + tileId + ': ' + JSON.stringify(event));
	client.send(client.tiles['TILES3'], '{"activation":"on"}');;
});

client.on('tileRegistered', function(tileId){
	console.log('Tile registered: ' + tileId);
});

client.on('tileUnregistered', function(tileId){
	console.log('Tile unregistered: ' + tileId);
});
