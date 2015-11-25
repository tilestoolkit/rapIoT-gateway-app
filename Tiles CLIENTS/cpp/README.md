#TileClient C++

##Dependencies
To be able to the cpp example, dependenies needed

	- [Mosquitto](http://mosquitto.org/)
	- [PTHREAD](https://www.sourceware.org/pthreads-win32/)

The `Mosquitto` needs to be included within the project itself, linking to both its `.h` and `.lib` files. Add linker and include path to the Mosquitto installation folder.

Pthread doesn't need to be included within the project itself, but as a dynamic library

###Static Libraries

	- mosquittopp.lib

###Dynamic Libraries

	- mosquitto.dll
	- mosquittopp.dll
	- pthreadVC2.dll

Dynamic libraries come prebuilt from dependency sources provided



#Examples
##VideoCapture
VideoCapture requires [OpenCV](http://opencv.org/) to be able to read from webcam connected to the computer.

Include and Linker folder needs to be setup according to chosen IDE.

###Static Libraries

	- opencv_ts`<version>`.lib
	- opencv_world`<version>`.lib

Where `<version>` is current version of OpenCV. Time of writing this is 3.0, so replace <version> with 300

###Dynamic Libraries

	- opencv_world`<version>`.dll