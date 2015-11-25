#TileClient

TileClient is packed as a python package. To install the package globally, and its required dependencies run:

	python setup.py develop



The TileClient package will now be made available in other python scripts by importing tileclient library

	import tileclient


##Modules
The tileclient module package comes with 3 packages. For module usage see `Examples/` folder. Available methods stated in each module `.py` file.

###TileApi
Accessing API route on remote server through `HTTP`

###TileClient
Accessing real-time events from server through `MQTT`

###TileListener
Topic Listener for triggering actions on certain topic matches. 





#Examples

##APItest
`apitest.py` testing TileCloud API and triggering event on a Tile connected by adding a listener to the topic pattern `/+/active`

The example pushed a message to topic `foo` with data `bar`

##MusicPlay
`musicplay.py` relies on mp3play library. Install dependency library by running in terminal: 

	pip install mp3play

The example also relies on a `.mp3` file residing within the directory, named `foobar.mp3`.