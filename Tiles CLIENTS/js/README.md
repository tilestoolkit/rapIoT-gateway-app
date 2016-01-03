# Tiles Client Library

Tiles Client Library is an event-driven API for the Tiles project written in JavaScript for Node.js and the browser. It's built on top of [MQTT.js](https://github.com/mqttjs/MQTT.js) and Node.js' [EventEmitter](https://github.com/Gozala/events).

* [Installation](#Installation)
* [Example](#Example)
* [API](#API)
* [Browser](#Browser)

<a name="Installation"></a>
## Installation

Install dependencies:  TO BE DONE
```sh
cd "Tiles CLOUD/client-lib"
npm install
```

To use this client library in the browser see the [Browser](#Browser) section.

<a name="Example"></a>
## Example

This example code connects to the server and then sends a message using a fake Tile ID.
The server will send it back to the client as the message is sent to all clients of the user.

```js
var TilesClient = require('tiles-client.js');

var client = new TilesClient('TestUser').connect();

client.on('connect', function(){
	console.log('Connected!');
	client.send('AB:CD:12:34:56', 'Hello World!');
});

client.on('receive', function(tileId, data){
	console.log('Message received from ' + tileId + ': ' + data);
});
```

Output:
```
Message received from AB:CD:12:34:56: Hello World!
```

<a name="API"></a>
## API

### Create client
Create a client by providing your username and connecting the the server.
```javascript
var tilesClient = new TilesClient([username]).connect();
```

### Events

Add listeneres for events by registering callback methods.
```javascript
tilesClient.on([event], [callback]);
```

#### Event `'connect'`

`function() {}`

Emitted on successful (re)connection to the server.

#### Event `'receive'`

`function(tileId, message) {}`

Emitted when a message sent from/to a Tile is received.
* `tileId` The ID of the Tile the message was sent to/from.
* `message` payload of the received packet

#### Event `'tileRegistered'`

`function(tileId) {}`

Emitted when a Tile is registered/connected.
* `tileId` The ID of the registered Tile

#### Event `'tileUnregistered'`

`function(tileId) {}`

Emitted when a Tile is unregistered/disconnected.
* `tileId` The ID of the unregistered Tile

<a name="Browser"></a>
## Browser

### Browserify

In order to use this client library in a browser, [Browserify](https://github.com/substack/node-browserify) can be used to create a stand-alone build.

```sh
cd "Tiles CLOUD/client-lib"
npm install // Install dependencies
npm install -g browserify // Install Browserify globally
browserify tiles-client.js -s TilesClient > browserTilesClient.js
```

This can also be done using a predefined script (after completing the steps under [Installation](#Installation)):

```sh
npm run [bundle-js | bundle-min-js]
```

This will create a bundled JavaScript file in the ``dist/`` directory. Use ``bundle-min-js`` if you want to create a minified version.

The generated module is AMD/CommonJS compatible. If no module system is found, an object ``TilesClient`` is added to the global namespace, which makes it accessible from the browser.
