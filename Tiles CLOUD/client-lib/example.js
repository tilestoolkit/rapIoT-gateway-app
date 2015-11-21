var TilesClient = require('./');

var client = new TilesClient('TestUser').connect();

client.on('connect', function(){
	console.log('Connected!');
	client.send('AB:CD:12:34:56', 'Hello World!');
});

client.on('receive', function(tileId, data){
	console.log('Message received from ' + tileId + ': ' + data);
});

client.on('tileRegistered', function(tileId){
	console.log('Tile registered: ' + tileId);
});

client.on('tileUnregistered', function(tileId){
	console.log('Tile unregistered: ' + tileId);
});