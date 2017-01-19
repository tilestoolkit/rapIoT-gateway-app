var WorkshopClient = require('../workshop-client');

var client = new WorkshopClient.TilesClient('TestUser', '138.68.144.206', 1883).connect();
var reader = new WorkshopClient.EventReader();


client.on('receive', function (tileId, event) {
	console.log(event);
	// WORK HERE!
	
    var Tile = reader.readEvent(event, client);
    // Do something with event tile.

    // Example: if TILE is single tapped --> Turn on green LED
    if(Tile.isSingleTap){
      Tile.ledOn('blue');
	  Tile.ledOn('blue');
    }
    if(eventTile.isDoubleTap){
      Tile.ledOff();
	 Tile.hapticBurst();
    }

});