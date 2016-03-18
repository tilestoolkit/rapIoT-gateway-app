/*
 * This example will print all received events to the console.
 * If a touch event originates from button A, a command to turn on red blinking light will be sent back.
 * If a touch event originates from button B, a command to turn off the light will be sent back.
 */
var TilesClient = require('../../');

var client = new TilesClient('TestUser', 'localhost', 1883).connect();

client.on('receive', function(tileId, event){
	console.log('Event received from ' + tileId + ': ' + JSON.stringify(event));
    if (event.name === 'buttonA' && event.properties[0] === 'touch'){
    	client.send(tileId, 'led', 'blink', 'red');
    } else if (event.name === 'buttonB' && event.properties[0] === 'touch'){
    	client.send(tileId, 'led', 'off');
    }
});