# Tiles WORKSHOP JS 2016
This directory contains the workshop client APIs and scenarios created for the two workshops organized in autumn, 2016.

In order to use the WorkshopClient, run 'npm install' from your console in the workshop-client directory. This will install the necessary node packages for the client to run properly.

Navigate into the node-examples for example scenarios and template-api.

## WorkshopClient
The WorkshopClient will contain references to several helper client APIs that can be used in the client code to extend the IoT scenarios and facilitate development.

The structure of the WorkshopClient can be seen below. The regular TilesClient used to read tiles events is encapuslated into the WorkshopClient.

```json
workshopClient = {
  "TilesClient": TilesClient,
  "EventReader": EventReader,
  "HueClient": HueClient,
  "PostmanClient": PostmanClient,
  "IFTTTClient": IFTTTClient
};
```

### 1-TilesClient
This is the regular TilesClient that will allow to read events from the TILES Cloud

Example:
```javascript
var WorkshopClient = require('../workshop-client');
new WorkshopClient.TilesClient({username}, {serveraddress}, 1883).connect();

client.on('receive', function(tileId, event){
  // Do something with event
  
  // Example: if TILE is single tapped --> Turn on blue LED
  if(event.properties[0] === 'tap'){
    if(event.properties[1].startsWith('single'){
      client.send(client.tiles[event.name], 'led', 'on', 'blue');
    }
  }
});
```

The event will contain properties regarding name of the tile the event occured on, and the properties of the event. Reading events directly on the event object will require string comparison, as the event contains string properties.

### 2-EventReader
The EventReader was implemented to simplify the process of reading events and communicating with TILES Devices.
The EventReader will performe the string comparison on the event, and return an object with boolean properties for the event type.

Example:
```javascript
var WorkshopClient = require('../workshop-client');
var client = new WorkshopClient.TilesClient('Anders', '138.68.144.206', 1883).connect();
var reader = new WorkshopClient.EventReader();

client.on('receive', function(tileId, event){
  var eventTile = reader.readEvent(event, client);
  // Do something with event tile.
  
  // Example: if TILE is single tapped --> Turn on green LED
  if(eventTile.isSingleTap){
    eventTile.ledOn('green');
  }
});
```
In complex scenarios, this way of reading events will simplify the coding considerably.

### 3-HueClient
The HueClient allows the client code to interact with Philips HUE light bulbs. For this client to work properly, you must be connected to the same local network as the HUE bridge. The client will automatically discover the IP of the bridge, but you must pass in the identifier of the user the bridge is connected to.

The methods of the HueClients takes in an array of integers as input, to identify what HUE bulbs that should receive the event.
```javascript
HueClient.switchOn(1);             // Switch on HUE bulbs with id = 1
HueClient.switchOff([1,2,5]);      // Switch off HUE bulbs with id = 1, 2 and 5
HueClient.toggleLights([ids]);     // Toggle state of HUE bulbs (on->off, off->on)
HueClient.blinkLights([ids]);      // Blink HUE bulbs
HueClient.setColor([ids], "{HEX}");// Set color of HUE bulbs {ex. HEX = "FF00FF"}
HueClient.randomColor([ids]);      //	Set a random color to HUE bulbs
HueClient.colorLoop([ids]);        // Starts a slow color loop on HUE bulbs
```

We still need to bring in the TilesClient and EventReader for reading events, but with the HueClient we can communicate with the Philips HUE.
```javascript
var HueClient = new WorkshopClient.HueClient('ABCDEFGHI123456789MVVvFEfC3MB7-odXvFAzC4');
var client = new WorkshopClient.TilesClient('Anders', '138.68.144.206', 1883).connect();
var reader = new WorkshopClient.EventReader();

client.on('receive', function(tileId, event){
  var eventTile = reader.readEvent(event, client);
  // Example: When double tapped on TILE, turn on HUE #1-3 with the color "#FF00FF" (pink)
  if(eventTile.isDoubleTap){
    HueClient.setColor([1,2,3], "FF00FF");
  }
});
```
### 4-IFTTT Client
With the IFTTTClient, we can create triggers for IFTTT maker channels. After configuring the channel in IFTTT, we can trigger it in our IoT application with a simple line in the client code.

As an arugment to the IFTTTClient, we will pass in our Personal IFTTT client secret, but that is all we need.
We still need to bring in the TilesClient and EventReader for reading events.
```javascript
var IFTTTClient = new workshopClient.IFTTTClient('dncBS7n2aVGR4Bf44Yx9Ck');
var client = new WorkshopClient.TilesClient('Anders', '138.68.144.206', 1883).connect();
var reader = new WorkshopClient.EventReader();

client.on('receive', function(tileId, event){
  var eventTile = reader.readEvent(event, client);
  // Example: When TILE is tilted, trigger 'post_to_facebook' event on IFTTT
  if(eventTile.isTilt){
    IFTTTClient.send('post_to_facebook');
  }
});
```

### 5-Postman Client
The PostmanClient, is an extended IFTTT Client. It will allow for HTTP POST and GET requests to be triggered by the IoT client code.
The PostmanClient should be set up by passing in IP/URL and PORT of the HTTP service.

```javascript
var PostmanClient = new workshopClient.PostmanClient('my-http-server-ip', 'my-service-port');
```

Then by calling 'get' or 'post', we can trigger get and post request to sub-domains on the server.

Example:
```javascript
var PostmanClient = new workshopClient.PostmanClient('192.168.1.6', 3000);
var client = new WorkshopClient.TilesClient('Anders', '138.68.144.206', 1883).connect();
var reader = new WorkshopClient.EventReader();

client.on('receive', function(tileId, event){
  var eventTile = reader.readEvent(event);
  
  if(eventTile.isSingleTap){
    PostmanClient.get('trigger/some/event'); // Will send a HTTP get to http://192.168.1.6:3000/trigger/some/event
    
    PostmanClient.post('trigger/another/event'); // Will send a HTTP post to http://192.168.1.6:3000/trigger/another/event
  }
});

```
