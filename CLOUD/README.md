# Tiles API Server

## Installation

1. Install [Node.js](http://nodejs.org/) and [MongoDB](https://www.mongodb.org/).

2. Install project dependencies
   ```sh
   cd "CLOUD"
   npm install
   ```

## Run

1. Run ``mongod.exe``. It should be located inside the ``bin`` folder of where MongoDB is installed (typically ``../MongoDB/Server/[version]/bin/``). This should initialize the database and listen for connections on the default port ``27017``.

2. Open a new console and navigate to the project directory and start the API server:
   ```sh
   cd "CLOUD"
   npm start
   ```

   This will run [Ponte](https://github.com/eclipse/ponte) with three servers: one for MQTT, one for HTTP, and one for CoAP, listening on ports 1883, 8080, and 5683, respectively.

## HTTP
The REST API can be used to list the Tiles registered to a user, and also be used to send real-time commands to the Tiles. To receive real-time events from the Tiles devices to your server see the [Webhooks](#Webhooks) section.

**Example command:**<br>
Activating the LED light: `{"activation": "on"}`

Method | Route | Description
--- | --- | ---
`GET` | /users/[userId]/tiles | List Tiles registered with this user
`GET` | /evt/[userId]/[tileId] | Get the most recent event sent from the Tile
`PUT` | /evt/[userId]/[tileId] | Simulate an event being sent from the Tile
`GET` | /cmd/[userId]/[tileId] | Get the most recent command sent to the Tile
`PUT` | /cmd/[userId]/[tileId] | Send a command to the Tile

<a name="Webhooks"></a>
## Webhooks
  
### REST API

The REST API can also be used to manage webhooks. Register a webhook by performing a `POST` request to `/webhooks/[userId]/[tileId]` with  a JSON message in the following format: `{"postUrl": "[postUrl]"}`. The same format is used for updating a webhook.

Overview of API methods for managing webhooks:

Method | Route | Description
--- | --- | ---
`GET` | /webhooks | List all webhooks
`GET` | /webhooks/[userId] | List webhooks registered with this user
`GET` | /webhooks/[userId]/[tileId] | List webhooks registered with this user and Tile
`POST` | /webhooks/[userId]/[tileId] | Create (register) a webhook
`GET` | /webhooks/[userId]/[tileId]/[webhookId] | Get a webhook
`PUT` | /webhooks/[userId]/[tileId]/[webhookId] | Update a webhook
`DELETE` | /webhooks/[userId]/[tileId]/[webhookId] | Delete (unregister) a webhook
  
### Web Interface
The server also has a simple web interface for managing webhooks.

Instructions for registering a webhook:

1. Navigate to your Tile administration page: `[domain]:3000/#/users/[userId]`
2. Click on the ID of the Tile you want to register a webhook for.
3. Enter the URL for callback in the input field under 'Register a new webhook'.
4. Click 'Register'.

### Message format
The body of the POST request will be a JSON message, and the request will therefore have a `Content-Type: application/json` header field. Based on the type of event that triggered the webhook, the JSON message will have one of the following formats:

- Tile event message:
  ```sh
  {
  	"tileId":"[tileId]",
  	"userId":"[userId]",
  	"state":{
    	"type":"[type]",
        "event":"[event]"
	}
  }
  ```
  
- Tile connected/disconnected:
  ```sh
  {
  	"tileId":"[tileId]",
  	"userId":"[userId]",
    "active":[active]
  }
  ```
  
Possible values:

Field | Type | Value
--- | --- | ---
**active** | Boolean | true / false
**state.type** | String | 'button_event'
**state.event** | String | 'pressed' / 'released'
