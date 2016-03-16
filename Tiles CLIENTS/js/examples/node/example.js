/*
* Hello World Example
*/
var TilesClient = require('../../');

var client = new TilesClient('Simone','localhost','1883').connect();

client.on('connect', function(){
	console.log('Connected!');
	client.send('8ED58908-9DD1-0501-81D0-F69A7E16BD68', '{"activation":"on"}');
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
