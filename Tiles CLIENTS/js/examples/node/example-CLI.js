/*
* Example: Message format supporting extensibility
*/
var TilesClient = require('../../');
var client = new TilesClient('simone', 'localhost', 1883).connect();

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('TILES> ');
rl.prompt();

rl.on('line', function(line) {
	if (line === "led")
		{
			client.send(client.tiles['TILES3'], 'led', 'blink', 'red');
			console.log("Sent command to TILES2 led blink red");
			rl.prompt();
		}
		if (line === "led2")
			{
				client.send(client.tiles['TILES1'], 'led', 'blink', 'red');
				console.log("Sent command to TILES1 led blink red");
				rl.prompt();
			}
			if (line === "off")
				{
					client.send(client.tiles['TILES3'], 'led', 'off');
					client.send(client.tiles['TILES1'], 'led', 'off');
					console.log("Sent command to both tiles to turn off");
					rl.prompt();
				}
    if (line === "exit")
		{
		rl.close(); //type exit to quit
		rl.prompt();
	}
});

rl.on('close',function(){
    process.exit(0);
});

client.on('connect', function(){
	console.log('Connected!');
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
