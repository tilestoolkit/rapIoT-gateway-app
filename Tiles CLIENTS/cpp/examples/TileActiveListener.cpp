#include "TileActiveListener.h"
#include <iostream>
TileActiveListener::TileActiveListener()
{
	setId(100);
}

void TileActiveListener::listener(const std::string& topic,const std::string& msg)
{
	std::cout << topic << " " << msg << std::endl;
}