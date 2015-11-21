var TilesClient = require('./');

var client = new TilesClient('TestUser').connect();

client.on('connect', function(){
	console.log('Connected!');
	client.send('AB:CD:12:34:56', 'Hello World!');
});

client.on('receive', function(deviceId, data){
	console.log('Message received from ' + deviceId + ': ' + data);
});