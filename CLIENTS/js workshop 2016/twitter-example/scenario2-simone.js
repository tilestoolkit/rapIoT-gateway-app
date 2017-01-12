var WorkshopClient = require('../workshop-client');

var client = new WorkshopClient.TilesClient('TestUser', '138.68.144.206', 1883).connect();
var reader = new WorkshopClient.EventReader();

var lastTweet = "NO TWEET";
var tileAname = 'Tile_33';

/** START OF TWITTER SPECIFIC CODE */
var Twit = require('twit');
var T = new Twit({
	consumer_key: 'MWOdyIMwmyXJ87L6b2IY3qHo7',
	consumer_secret: 'W7WaGkGjef8kJhmYGqpqFxWaUi1YFWNkqzZccshOINlZ4dGyyL',
	access_token: '788452963375284224-McPIQnACDhKsgKa35v5QJURKpFGNXZF',
	access_token_secret: 'FTXjyX369ujzAHYprxZgTBDtzaB0ecuo5ynJ43mH8JQ2R',
	timeout_ms: 60 * 10000000,  // optional HTTP request timeout to apply to all requests.
});
var start = function () {
	console.log("starting..");
	var stream = T.stream('statuses/filter', { follow: ['CroMAR_test'] })
	stream.on('tweet', function (tweet) {
		var tileA = reader.getTile(tileAname, client);
		tileA.hapticBurst();

		console.log(tweet.text);
		lastTweet = tweet.text;
	});
	stream.on('error', function () {
		console.log("error...");
		start();
	});
}
start();
/** END OF TWITTER SPECIFIC CODE */

client.on('receive', function (tileId, event) {
	console.log('Message received from ' + tileId + ': ' + JSON.stringify(event));

	var eventTile = reader.readEvent(event, client);

	var tileA = reader.getTile(tileAname, client);
	var tileB = reader.getTile('Tile_e7', client);

	var printer = reader.getPrinter('Tile_70', client);

	/**
	 * Scenario A:
	 * TileA vibrates on new tweet.
	 * If single tap on TileB, print last tweet
	 */

	if (eventTile.name == tileB.name && eventTile.isSingleTap) {
		printer.print(lastTweet);
	}
});