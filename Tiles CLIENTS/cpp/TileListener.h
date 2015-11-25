#ifndef TILELISTENER_H
#define TILELISTENER_H

#include <string>
/**
* Listener for Tile
*/
class TileListener
{
	private:
		int listenerId=0;
	public:
		virtual void listener(const std::string&,const std::string&) = 0;//topic

		int getId() { return listenerId; }
		void setId(int id) { listenerId = id; }
};

#endif