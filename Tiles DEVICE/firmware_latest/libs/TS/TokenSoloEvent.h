/**************************************************************************
# 	NAME: TokenSoloEvent.h
# 	AUTHOR: Matthias Monnier (matthias.monnier@gmail.com)
# 	DATE: 16/12/2015
# 	LICENSE: Apache V2.0(cf. file license.txt in the main repository)
#
# 	Header of the library which manages the Token solo events
#
**************************************************************************/

#ifndef TokenSoloEvent_h
#define TokenSoloEvent_h

#include <Arduino.h>
#include "Adafruit_Sensor.h"
#include "Adafruit_ADXL345_U.h"

class TokenSoloEvent {
      public:
		TokenSoloEvent(int pin_accel);
		void accelConfig();
		void accelComputation(int* tab, int bit3, int bit4, int bit5, int bit6, int* inactivity, int* single_tap, int* double_tap, int* shake);
		int accelGetX();
		int accelGetY();
		int accelGetZ();
		bool tiltComputation();
		
		Adafruit_ADXL345_Unified accel;
	  private:
		int _pin_accel;
};

#endif
