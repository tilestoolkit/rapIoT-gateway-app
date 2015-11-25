#ifndef TILEALISTEN_H
#define TILEALISTEN_H

#include "TileListener.h"
#include <string>

class TileActiveListener : public TileListener
{
public:
	TileActiveListener();

	virtual void listener(const std::string&,const std::string&);
};




#endif