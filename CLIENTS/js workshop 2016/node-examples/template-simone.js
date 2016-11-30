var WorkshopClient = require('../workshop-client');

var client = new WorkshopClient.TilesClient('TestUser', '138.68.144.206', 1883).connect();
var reader = new WorkshopClient.EventReader();
// var HueClient = new WorkshopClient.HueClient('PCz7eZwSifbpmLTQCdMVVvFEfC3MB7-odXvFAzC4');
// var PostmanClient = new WorkshopClient.PostmanClient('192.168.1.6', 3000);
// var IFTTTClient = new WorkshopClient.IFTTTClient('dncBS7n2aVGR4Bf44Yx9Ck');



client.on('receive', function (tileId, event) {
	console.log(event);
	// WORK HERE!
	
    var eventTile = reader.readEvent(event, client);
    // Do something with event tile.

    // Example: if TILE is single tapped --> Turn on green LED
    if(eventTile.isSingleTap){
      eventTile.ledOn('green');
    }
    if(eventTile.isDoubleTap){
      eventTile.ledOff();
    }

});