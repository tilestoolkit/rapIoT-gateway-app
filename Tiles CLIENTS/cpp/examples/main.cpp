#include <iostream>
#include "MQTTclient.h"
#include "TileActiveListener.h"
#include "VideoCaptureListener.h"
using namespace std;

int main()
{

	std::cout << "MOSQUITTO V(" << LIBMOSQUITTO_VERSION_NUMBER << ") UP AND RUNNING"<<endl;

	MQTTClient *m = new MQTTClient("testuser","localhost",3001);
	m->addPatternListener("testuser/+/active", new VideoCaptureListener());
	m->run();

	delete m;

	std::cin.get();
	return 0;
}