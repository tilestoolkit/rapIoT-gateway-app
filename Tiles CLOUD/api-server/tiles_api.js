var http = require('http');

var tilesApi = {};

tilesApi.setDeviceState = function(tileId, userId, state, active){
	if (tileId == null) {
		console.log("Tile ID can't be undefined or null");
		return;	
	} 

	var fieldsToSend = {}; // Only send fields that are defined and not null
	fieldsToSend.tileId = tileId;
  	if (userId != null) fieldsToSend.userId = userId;
  	if (state != null) fieldsToSend.state = state;
  	if (active != null) fieldsToSend.active = active;

	var data = JSON.stringify(fieldsToSend);
	console.log('POST: Sending device data: '+data);

	var options = {
	    port: 3000,
	    path: '/tiles',
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json',
	        'Content-Length': Buffer.byteLength(data)
	    }
	};

	var req = http.request(options, function(res) {
	    res.setEncoding('utf8');
	    res.on('data', function (chunk) {
	        console.log("Response Body: " + chunk);
	    });
	});

	req.write(data);
	req.end();
}

module.exports = tilesApi;