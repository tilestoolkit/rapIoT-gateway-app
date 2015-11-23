# Tiles API Server

## Installation

1. Install [Node.js](http://nodejs.org/) and [MongoDB](https://www.mongodb.org/).

2. Install project dependencies
   ```sh
   cd "Tiles CLOUD/api-server"
   npm install
   ```

## Run

1. Run ``mongod.exe``. It should be located inside the ``bin`` folder of where MongoDB is installed (typically ``../MongoDB/Server/[version]/bin/``). This should initialize the database and listen for connections on the default port ``27017``.

2. Open a new console and navigate to the project directory and start the API server:
   ```sh
   cd "Tiles CLOUD/api-server"
   npm start
   ```

   This will run [Ponte](https://github.com/eclipse/ponte) with three servers: one for MQTT, one for HTTP, and one for CoAP, listening on ports 1883, 8080, and 5683, respectively.