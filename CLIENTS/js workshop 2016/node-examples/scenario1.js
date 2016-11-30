/** Getting WorkshopClient */
var WorkshopClient = require('../workshop-client');

// Required helper clients are initialized
var HueClient = new WorkshopClient.HueClient('PCz7eZwSifbpmLTQCdMVVvFEfC3MB7-odXvFAzC4');
var client = new WorkshopClient.TilesClient('Anders', '138.68.144.206', 1883).connect();
var reader = new WorkshopClient.EventReader();

// State parameters for Scenario1
var colorHex = ['FF0000', '00FF00', '0000FF', 'FFFFFF', 'F0F00F', 'A0A0FF', 'FF00FF'];
var ct = 0;

// On receive for client
client.on('receive', function (tileId, event) {
	console.log('Message received from ' + tileId + ': ' + JSON.stringify(event));

	// Define eventTile
	var eventTile = reader.readEvent(event, client);

	// Define tileA and tileB
	var tileA = reader.getTile("Tile_9e", client);
	var tileB = reader.getTile("Tile_e9", client);

	/**
	 * Scenario description:
	 * Single tap on TileA -> Set color on TileA.LED from array [red, green, blue, white]
	 * Double tap on TileA -> Copy color to Philips HUE and TileB.LED && vibrate TileB and TileC
	 */

	// Look at events on tileA
	if (eventTile.name === tileA.name) {

		// Loop through colors on LED on single tap
		if (eventTile.isSingleTap) {
			ct++;
			if (ct >= colorHex.length) {
				ct = 0;
			}

			tileA.ledOn(colorHex[ct]);
		}
		// Copy color from tileA to HUE and tileB, and set vibrate on double tap
		else if (eventTile.isDoubleTap) {
			HueClient.setColor([1, 2, 3, 4, 5], colorHex[ct]);
			tileB.ledOn(colorHex[ct]);
			tileB.hapticBurst();
		}
		// EXTRA: If TileA is tilted -> Switch off lights and TileB.LED
		else if (eventTile.isTilt) {
			HueClient.switchOff([1, 2, 3, 4, 5]);
			tileB.ledOff();
		}
	}
});