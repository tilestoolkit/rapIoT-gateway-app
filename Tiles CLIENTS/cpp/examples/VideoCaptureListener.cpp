#include "VideoCaptureListener.h"
using namespace cv;


VideoCaptureListener::VideoCaptureListener()
{
}

void VideoCaptureListener::listener(const std::string& topic, const std::string& data)
{
	VideoCapture cap(0); // open the default camera
	if (!cap.isOpened()) // check if we succeeded
		return;

	Mat edges;
	namedWindow("edges", 1);

	for (int i = 0; i<10; ++i)//making sure that video will be grabbed and shown in new window
	{
		Mat frame;
		cap >> frame;
		imshow("webcam", frame);//put frame to window
		if (frame.empty())
			break;
		if (waitKey(30) >= 0) break;
	}
}