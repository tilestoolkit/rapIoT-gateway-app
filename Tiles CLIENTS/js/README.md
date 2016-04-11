# Tiles Client Library

Tiles Client Library is an event-driven API for the Tiles project written in JavaScript for Node.js and the browser. It's built on top of [MQTT.js](https://github.com/mqttjs/MQTT.js) and Node.js' [EventEmitter](https://github.com/Gozala/events).

* [Installation](#Installation)
* [Example](#Example)
* [API](#API)
* [Browser](#Browser)

<a name="Installation"></a>
## Installation

Install dependencies:
```sh
npm install
```

To use this client library in the browser see the [Browser](#Browser) section.

<a name="Example"></a>
## Example

This example code connects to the server as `TestUser`. Whenever an event is received, the event will be printed to the console. If a touch event originates from button A, a command to turn on red blinking light will be sent back. If a touch event originates from button B, a command to turn off the light will be sent back.

```js
var TilesClient = require('tiles-client.js');

var client = new TilesClient('TestUser', 'localhost', 1883).connect();

client.on('receive', function(tileId, event){
	console.log('Event received from ' + tileId + ': ' + JSON.stringify(event));
    if (event.name === 'buttonA' && event.properties[0] === 'touch'){
    	client.send(tileId, 'led', 'blink', 'red');
    } else if (event.name === 'buttonB' && event.properties[0] === 'touch'){
    	client.send(tileId, 'led', 'off');
    }
});
```

<a name="API"></a>
## API

### Create client
Create a client by providing your username and connecting the the server.
```javascript
var tilesClient = new TilesClient([username], [host], [port]).connect();
```
If `[host]` and/or `[port]` is omitted the client will fall back to use defaults.

### Commands
Send a command to a Tile with a property name and an arbitrary number of property values. Currently, the total number of characters in the property name and values is limited to maximum `20 - [Number of property values]` characters.
```javascript
tilesClient.send([tileId], [propertyName], [propertyValue1], [propertyValue2], [...]);
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

`function(tileId, event) {}`

Emitted when a message sent from/to a Tile is received.
* `tileId` The ID of the Tile the message was sent to/from.
* `event` An event object (Parsed JSON payload of the received packet)

#### Event `'tileRegistered'`

`function(tileId) {}`

Emitted when a Tile is registered/connected.
* `tileId` The ID of the registered Tile

#### Event `'tileUnregistered'`

`function(tileId) {}`

Emitted when a Tile is unregistered/disconnected.
* `tileId` The ID of the unregistered Tile

<a name="GetTileByName"></a>
### Get Tile by name
Get the ID of a Tile by looking it up by name.
```javascript
tilesClient.tiles['TILES1']
```

<a name="Browser"></a>
## Browser

### Browserify

In order to use this client library in a browser, [Browserify](https://github.com/substack/node-browserify) can be used to create a stand-alone build.

```sh
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