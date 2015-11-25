#ifndef VIDEOL_H
#define VIDEOL_H

#include <opencv2/objdetect/objdetect.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>

#include "TileListener.h"
using namespace cv;

class VideoCaptureListener : public TileListener
{

public:
	VideoCaptureListener();

	virtual void listener(const std::string&, const std::string&);

};

#endif
