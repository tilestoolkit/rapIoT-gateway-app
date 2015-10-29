#Installation
Before installing all dependencies, Python v2.7.* is needed for bcrypt to work. 
Download it from [here](https://www.python.org/downloads/release/python-2710/).

For building bcrypt, node-gyp is also needed:
`npm install -g node-gyp`

##Dependencies
Install all dependencies by running `npm install`. This should create a folder `node_modules/` with all
defined dependencies


##Running
To restart the node server on saving, install nodemon: `npm install -g nodemon`.
You can now start the node server by typing `nodemon index.js`, and the server will restart on each save.


