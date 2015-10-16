#Installation
To start using the Tile-Cloud server you need to have nodejs installed, download it from [here](https://nodejs.org/en/).

##Dependencies
Dependencies of the Tile-Cloud server is defined in the `package.json` file. 
Install all dependencies by opening the terminal, and running the command:
 
 `npm install`
 
 which will install all dependencies in the `node_modules` folder.
 
 After installing all dependencies, the application is ready for running.
 
###Mosca
 Tile-Cloud Server is using [mosca](https://github.com/mcollina/mosca) which is a mqtt broker. It is configured to
 accept connections over mqtt and mqtt over websockets. 

 
##Start
Start the application by running `node index.js` in the terminal.




#Code

##mqServer.js
##tileMsg.js
##tileParse.js
##TileServer.js