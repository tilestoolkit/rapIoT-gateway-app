/*
* Hello World Example
*/
var TilesClient = require('../../');

var client = new TilesClient('TestUser','test.mosquitto.org','1883').connect();

client.on('connect', function(){
	console.log('Connected!');
	client.send('AB:CD:12:34:56', 'Hello World!');
});

client.on('receive', function(tileId, event){
	console.log('Message received from ' + tileId + ': ' + JSON.stringify(event));
});

client.on('tileRegistered', function(tileId){
	console.log('Tile registered: ' + tileId);
});

client.on('tileUnregistered', function(tileId){
	console.log('Tile unregistered: ' + tileId);
});
