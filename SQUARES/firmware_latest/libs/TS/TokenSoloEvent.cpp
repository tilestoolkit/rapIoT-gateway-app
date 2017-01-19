/**************************************************************************
# 	NAME: TokenSoloEvent.cpp
# 	AUTHOR: Matthias Monnier (matthias.monnier@gmail.com)
# 	DATE: 16/12/2015
# 	LICENSE: Apache V2.0(cf. file license.txt in the main repository)
#
# 	Library which manages the Token solo events
#
**************************************************************************/

#include "TokenSoloEvent.h"

/**************************************************************************
#	Constructor, receive the accelerometer's pin
**************************************************************************/
TokenSoloEvent::TokenSoloEvent(int pin_accel)
:_pin_accel(pin_accel)
{
	/* Assign a unique ID to this sensor at the same time */
	Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);

	//Serial.println("Constructor");
	pinMode(_pin_accel, INPUT);
}

/**************************************************************************
#	Initiate the sensor
**************************************************************************/
void TokenSoloEvent::accelConfig()
{
	/* Initialise the sensor */
    if(!accel.begin())
    {
      /* There was a problem detecting the ADXL345 ... check your connections */
      Serial.println("Ooops, no ADXL345 detected ... Check your wiring!");
      while(1);
    }

	  /* Set the range to whatever is appropriate for your project */
    accel.setRange(ADXL345_RANGE_2_G);
    accel.setDataRate(ADXL345_DATARATE_6_25HZ);

    // enable single and double tap interrupt + activity/inactivity interrupts
    accel.writeRegister(ADXL345_REG_INT_ENABLE, 0b01111000);

    // map all interrupts in the INT1 pin
    accel.writeRegister(ADXL345_REG_INT_MAP, 0b00000000);

    /************************** Activity and Inactivity configuration **************************/
    // accel.writeRegister(ADXL345_REG_THRESH_ACT, 8);
    // accel.writeRegister(ADXL345_REG_THRESH_INACT, 3);
    // accel.writeRegister(ADXL345_REG_TIME_INACT, 0b00000001);
    // accel.writeRegister(ADXL345_REG_ACT_INACT_CTL, 0b11111111);

    /*********************** Tap and double tap configuration ************************/
    // single tap configuration
    accel.writeRegister(ADXL345_REG_DUR, 0x30);
    accel.writeRegister(ADXL345_REG_THRESH_TAP, 0x40);
    accel.writeRegister(ADXL345_REG_TAP_AXES, 0b001); // enable tap detection on the z axe

    // double tap configuration
    accel.writeRegister(ADXL345_REG_LATENT, 100);
    accel.writeRegister(ADXL345_REG_WINDOW, 255);
    /*************************************************************************************/

    //read and clear interrupts
    accel.readRegister(ADXL345_REG_INT_SOURCE);
}

/**************************************************************************
#	Receive bit from the data register of the accelerometer and compute
#	them in order to know if the accelerometer is active/inactive/shaken/
#	tilt/tap/double tap
**************************************************************************/
void TokenSoloEvent::accelComputation(int* tab, int bit3, int bit4, int bit5, int bit6, int* inactivity, int* single_tap, int* double_tap, int* shake)
{
      if(bit5)
      {
        if(tab[1] && tab[0])
        {
			//Serial.println("SHAKE");
          *shake = 1;
        }
        else
        {
		  //Serial.println("DOUBLE_TAP");
          *double_tap = 1;
        }
      }
      else if(bit6)
      { // when a double tap is detected also a signle tap is deteced. we use an else here so that we only print the double tap
        if(tab[1] && tab[0])
        {
			//Serial.println("SHAKE");
          *shake = 1;
        }
        else
        {
			//Serial.println("SINGLE_TAP");
  		  *single_tap = 1;
        }
      }
      if(bit3)
      {
        tab[1] = tab[0];
        tab[0] = 0;
        *inactivity = 1;
        //Serial.println("### Inactivity ");
      }
      if(bit4)
      {
        tab[1] = tab[0];
        tab[0] = 1;
        *inactivity = 0;
        //Serial.println("### Activity ");
      }
}

/**************************************************************************
#	Return the acceleration value on x axis
**************************************************************************/
int TokenSoloEvent::accelGetX()
{
	/* Get a new sensor event */
	sensors_event_t event;
	accel.getEvent(&event);

	/* Display the results (acceleration is measured in m/s^2) */
	// Serial.print("X: "); Serial.print(event.acceleration.x);
	// Serial.println("m/s^2 ");
	return event.acceleration.x;
}

/**************************************************************************
#	Return the acceleration value on y axis
**************************************************************************/
int TokenSoloEvent::accelGetY()
{
	/* Get a new sensor event */
	sensors_event_t event;
	accel.getEvent(&event);

	/* Display the results (acceleration is measured in m/s^2) */
	// Serial.print("Y: "); Serial.print(event.acceleration.y);
	// Serial.println("m/s^2 ");
	return event.acceleration.y;
}

/**************************************************************************
#	Return the acceleration value on z axis
**************************************************************************/
int TokenSoloEvent::accelGetZ()
{
	/* Get a new sensor event */
	sensors_event_t event;
	accel.getEvent(&event);

	/* Display the results (acceleration is measured in m/s^2) */
	// Serial.print("Z: "); Serial.print(event.acceleration.z);
	// Serial.println("m/s^2 ");
	return event.acceleration.z;
}

/**************************************************************************
#	Return true if the accelerometer is tilted
**************************************************************************/
bool TokenSoloEvent::tiltComputation()
{
	return(abs(accelGetX())> 7 || abs(accelGetY()) > 7);
}
