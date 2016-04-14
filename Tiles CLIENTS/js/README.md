# Tiles Client Library

Tiles Client Library is an event-driven API for the Tiles project written in JavaScript for Node.js and the browser. It's built on top of [MQTT.js](https://github.com/mqttjs/MQTT.js) and Node.js' [EventEmitter](https://github.com/Gozala/events).

* [Installation](#Installation)
* [Example](#Example)
* [API](#API)
* [Browser](#Browser)

<a name="Installation"></a>
## JS Library Installation

Install dependencies:
```sh
npm install
```

To use this client library in the browser see the [Browser](#Browser) section.

## Fundamentals 

Tiles applications are based on Tiles modules exchanging *events* and *commands*, encapsulating interaction primitives, between each other and with third-party clients. 

![GitHub Logo](/imgs/events-commands.png)

An *event* describes and input primitive, like a tile being tapped, shaken or rotated. 

A *command* describes an output primitive provided by a tile module, for example vibrating, changing the LED colors or emitting a sound.

Events and commands are characterized by *name* and *two optinal parameters* which further describe the type of interaction primitive happening.

The list of events and commands currently implemented is available [HERE](https://docs.google.com/spreadsheets/d/1b0ByrMQosh1BtK5hjAW2eLOzJf7y3-SCpFSCwuzxlRg/edit?usp=sharing)

<a name="Example"></a>
## Hello World Example

This code showcasse how to connect to Tiles Cloud, receive an event (input primitive) from Tiles and send a command (output primitive) to one or more tiles. Whenever an event is received, the event will be printed to the console.

In this example first we connect to Tiles Cloud as `TestUser`. Then whenever the Tile with name `tileID` is tapped once it will start blinking in red. Whenever `tileID`is tapped twice it will turn the LED off.

```js
var TilesClient = require('tiles-client.js');

var client = new TilesClient('TestUser').connect();

client.on('receive', function(tileId, event){
	console.log('Event received from ' + tileId + ': ' + JSON.stringify(event));
    if (event.name === 'tap' && event.properties[0] === 'single'){
    	client.send(tileId, 'led', 'blink', 'red');
    } else if (event.name === 'tap' && event.properties[0] === 'double'){
    	client.send(tileId, 'led', 'off');
    }
});
```

<a name="API"></a>
## API

### Create client
Create a client by providing your username and connecting the default Tiles Cloud server.
```javascript
var tilesClient = new TilesClient([username]).connect();
```

*OPTIONAL:* create a client by providing your username and connecting to a custo Tiles Cloud server.
```javascript
var tilesClient = new TilesClient([username], [server_address], [port]).connect();
```

### Send a command to one tile
Send a command to a Tile with a command name and up to two optional parameters.
```javascript
tilesClient.send([tileId], [commandName], [parameter1], [parameter2]);
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

Emitted when a message sent from/to a Tile is received. (See Hello World example above)
* `tileId` The ID of the Tile the message was sent to/from.
* `event` An event object (Parsed JSON payload of the received packet)
* `event.name` Name of the event received
* `event.properties[0]` Parameter#1
* `event.properties[1]` Parameter#2

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
Get the MAC Address of a Tile by looking it up by name.
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