var WorkshopClient = require('../workshop-client');

var client = new WorkshopClient.TilesClient('Anders', '138.68.144.206', 1883).connect();
var reader = new WorkshopClient.EventReader();
var PostmanClient = new WorkshopClient.PostmanClient('192.168.1.6', 3000);


client.on('receive', function (tileId, event) {
	console.log('Message received from ' + tileId + ': ' + JSON.stringify(event));

	var eventTile = reader.readEvent(event, client);

	var tileA = reader.getTile('Tile_e7', client);

	/**
	 * Scenario 3:
	 * If single tap on TileA, start song
	 * If double tap on TileA, stop song
	 */

	if (eventTile.name == tileA.name) {
		if (eventTile.isSingleTap) {
			PostmanClient.get('start');

		} else if (eventTile.isDoubleTap) {
			PostmanClient.get('stop');
		}
	}


});