/*
 * Third-party Integration Example - Slack
 * This example uses the LED light on the Tiles device to notify the user
 * of a newly published message on Slack.
 *
 * When a message is sent to a channel to which the user is subscribed to,
 * the LED light on all connected Tiles will be activated. The lights can
 * be turned off by pressing the button on any connected device.
 */
var https = require('https');
var WebSocketClient = require('websocket').client;
var wsClient = new WebSocketClient();

var TilesClient = require('../../');
var tilesClient = new TilesClient('TestUser','test.mosquitto.org','1883').connect();
var registeredTiles = [];

var slackAuthToken = require('./slack-auth-token');
var slackAuthUrl = 'https://slack.com/api/rtm.start?token='+slackAuthToken;
var slackUserId;

// Make an authenticated call to Slack's rtm.start API method to retrieve
// a WebSocket URL for the message server.
https.get(slackAuthUrl, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var json = JSON.parse(body);
        slackUserId = json.self.id;
        wsClient.connect(json.url);
    });
}).on('error', function(e){
      console.log('Error: ' + e);
});

// Called when the client has successfully connected to Slack's WebSocket.
// Adds a function to handle messages received over this WebSocket connection.
wsClient.on('connect', function(wsConnection){
	wsConnection.on('message', function(message){
		var data = JSON.parse(message.utf8Data);
		if (data){
			if (data.type === 'message'){
				if (data.user === slackUserId){
					console.log('[SLACK] A message was sent by this user.');
				} else {
					console.log('[SLACK] ' + data.user + ': ' + data.text)
					setTileActivation(true);
				}
			}
		}
	});
});

var setTilesActivation = function(activation){
	var activation = activation ? 'on' : 'off';
	var length = registeredTiles.length;
	for (var i = 0; i < length; i++) {
    	tilesClient.send(registeredTiles[i], '{"activation": "' + activation + '"}');
	}
}

tilesClient.on('receive', function(tileId, data){
	try {
		var json = JSON.parse(data);
		if (json && json.type === 'button_event' && json.event === 'pressed') {
			setTilesActivation(false);
		}
	} catch (error) {
		console.log('Error: ' + error);
	}
});

tilesClient.on('tileRegistered', function(tileId){
	registeredTiles.push(tileId);
});

tilesClient.on('tileUnregistered', function(tileId){
	var index = registeredTiles.indexOf(tileId);
	if (index > -1) {
    	registeredTiles.splice(index, 1);
	}
});
