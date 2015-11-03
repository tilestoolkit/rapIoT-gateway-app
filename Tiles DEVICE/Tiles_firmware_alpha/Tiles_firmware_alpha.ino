#include <RFduinoBLE.h>
#include "mpr121.h"
#include <Wire.h>
#include <WInterrupts.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_ADXL345_U.h>

//Accelerometer Configuration
#define ACC_INT1_PIN 4 // Pin where the acceleromter interrupt1 is connected
/* Assign a unique ID to this sensor at the same time */
Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);
volatile uint8_t intSource = 0; // byte with interrupt informations
volatile int tab[] = {'0', '0'};

//MPR121 Configuration
int irqpin = 3;  
boolean touchStates[12]; //to keep track of the previous touch states

//LED Configuration
int redPin = 0;
int greenPin = 1;
int bluePin = 4;
//uncomment this line if using a Common Anode LED
#define COMMON_ANODE

void setup() {

  //LED Setup
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);  
  setColor(255, 0, 0);  // red
  delay(1000);
  setColor(0, 255, 0);  // green
  delay(1000);
  setColor(0, 0, 255);  // blue
  delay(200);
  
  //Accelerometer setup
  // Enable interrupts :
  interrupts();
  // GPIO 3 handles INT1 of the accelerometer :
  pinMode(ACC_INT1_PIN, INPUT);
  Serial.begin(9600);
  Serial.println("Accelerometer Test"); 
  
  /* Initialise the sensor */
  if(!accel.begin())
  {
    /* There was a problem detecting the ADXL345 ... check your connections */
    Serial.println("Ooops, no ADXL345 detected ... Check your wiring!");
    while(1);
  }
  /* Set the range to whatever is appropriate for your project */
  accel.setRange(ADXL345_RANGE_2_G);
  // enable single and double tap interrupt + activity/inactivity interrupts
  accel.writeRegister(ADXL345_REG_INT_ENABLE, 0b01111000);
  // map all interrupts in the INT1 pin
  accel.writeRegister(ADXL345_REG_INT_MAP, 0b00000000);

  /************************** Activity and Inactivity configuration **************************/
  accel.writeRegister(ADXL345_REG_THRESH_ACT, 8);
  accel.writeRegister(ADXL345_REG_THRESH_INACT, 3);
  accel.writeRegister(ADXL345_REG_TIME_INACT, 0b00000001);
  accel.writeRegister(ADXL345_REG_ACT_INACT_CTL, 0b11111111);

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

    //MPR121 Setup
  pinMode(irqpin, INPUT);
  digitalWrite(irqpin, HIGH); //enable pullup resistor
  Serial.begin(9600);
  Wire.begin();
  mpr121_setup();


  //Bluetooth Setup
  //set the device name
  RFduinoBLE.deviceName = "Tiles_Alpha";
  //set the data we want to appear in the advertisement (max 31bytes)
  RFduinoBLE.advertisementData = "Tiles_Alpha";
  //set advertising interval in ms (low-longer battery life)
  RFduinoBLE.advertisementInterval = 200;
  //set tx signal strenght (value between -30 and +4dDm in 4dBm increments)
  RFduinoBLE.txPowerLevel = -20;
  //start the BLE stack
  RFduinoBLE.begin();
}

void loop() {
  //Touch sensor loop
  readTouchInputs();

  //accelerometer loop
  if(digitalRead(ACC_INT1_PIN)) {
    intSource = accel.readRegister(ADXL345_REG_INT_SOURCE);
    if(bitRead(intSource, 5)) 
    {
      if(tab[1] && tab[0])
      {
        Serial.println("### Shake ");
      }
      else
      {
        Serial.println("### DOUBLE_TAP ");
      }
    }
    else if(bitRead(intSource, 6)) 
    { // when a double tap is detected also a signle tap is deteced. we use an else here so that we only print the double tap
      if(tab[1] && tab[0])
      {
        Serial.println("### Shake ");
      }
      else
      {
        Serial.println("### SINGLE_TAP ");
      }
    }
    if(bitRead(intSource, 3)) 
    {
      tab[1] = tab[0];
      tab[0] = 0;
      //Serial.println("### Inactivity ");
    }
    if(bitRead(intSource, 4)) 
    {
      tab[1] = tab[0];
      tab[0] = 1;
      //Serial.println("### Activity ");
    }
  }
  delay(300); // IMPORTANT DELAY
}

void readTouchInputs() {
  if (!checkInterrupt()) {
    //read the touch state from the MPR121
    Wire.requestFrom(0x5A, 2);
    byte LSB = Wire.read();
    byte MSB = Wire.read();
    uint16_t touched = ((MSB << 8) | LSB); //16bits that make up the touch states
    for (int i = 0; i < 12; i++) { // Check what electrodes were pressed
      if (touched & (1 << i)) {
        if (touchStates[i] == 0) {
          //pin i was just touched
          Serial.print("pin ");
          Serial.print(i);
          Serial.println(" was just touched");
          RFduinoBLE.send(1);         
         setColor(255, 0, 0);  // red       
        } else if (touchStates[i] == 1) {
          //pin i is still being touched
          setColor(255, 0, 0);  // red 
        }
        touchStates[i] = 1;
      } else {
        if (touchStates[i] == 1) {
          Serial.print("pin ");
          Serial.print(i);
          Serial.println(" is no longer being touched");
          RFduinoBLE.send(0);          
         setColor(0, 255, 0);  // green
          //pin i is no longer being touched
        }
        touchStates[i] = 0;
      }
    }
  }
}

void mpr121_setup(void) {

  set_register(0x5A, ELE_CFG, 0x00);

  // Section A - Controls filtering when data is > baseline.
  set_register(0x5A, MHD_R, 0x01);
  set_register(0x5A, NHD_R, 0x01);
  set_register(0x5A, NCL_R, 0x00);
  set_register(0x5A, FDL_R, 0x00);

  // Section B - Controls filtering when data is < baseline.
  set_register(0x5A, MHD_F, 0x01);
  set_register(0x5A, NHD_F, 0x01);
  set_register(0x5A, NCL_F, 0xFF);
  set_register(0x5A, FDL_F, 0x02);

  // Section C - Sets touch and release thresholds for each electrode
  set_register(0x5A, ELE0_T, TOU_THRESH);
  set_register(0x5A, ELE0_R, REL_THRESH);

  set_register(0x5A, ELE1_T, TOU_THRESH);
  set_register(0x5A, ELE1_R, REL_THRESH);

  set_register(0x5A, ELE2_T, TOU_THRESH);
  set_register(0x5A, ELE2_R, REL_THRESH);

  set_register(0x5A, ELE3_T, TOU_THRESH);
  set_register(0x5A, ELE3_R, REL_THRESH);

  set_register(0x5A, ELE4_T, TOU_THRESH);
  set_register(0x5A, ELE4_R, REL_THRESH);

  set_register(0x5A, ELE5_T, TOU_THRESH);
  set_register(0x5A, ELE5_R, REL_THRESH);

  set_register(0x5A, ELE6_T, TOU_THRESH);
  set_register(0x5A, ELE6_R, REL_THRESH);

//  set_register(0x5A, ELE7_T, TOU_THRESH);
//  set_register(0x5A, ELE7_R, REL_THRESH);
//
//  set_register(0x5A, ELE8_T, TOU_THRESH);
//  set_register(0x5A, ELE8_R, REL_THRESH);
//
//  set_register(0x5A, ELE9_T, TOU_THRESH);
//  set_register(0x5A, ELE9_R, REL_THRESH);
//
//  set_register(0x5A, ELE10_T, TOU_THRESH);
//  set_register(0x5A, ELE10_R, REL_THRESH);
//
//  set_register(0x5A, ELE11_T, TOU_THRESH);
//  set_register(0x5A, ELE11_R, REL_THRESH);
  // Section D
  // Set the Filter Configuration
  // Set ESI2
  set_register(0x5A, FIL_CFG, 0x04);
  // Section E
  // Electrode Configuration
  // Set ELE_CFG to 0x00 to return to standby mode
  set_register(0x5A, ELE_CFG, 0x0C);  // Enables all 12 Electrodes
  // Section F
  // Enable Auto Config and auto Reconfig
  /*set_register(0x5A, ATO_CFG0, 0x0B);
  set_register(0x5A, ATO_CFGU, 0xC9);  // USL = (Vdd-0.7)/vdd*256 = 0xC9 @3.3V   set_register(0x5A, ATO_CFGL, 0x82);  // LSL = 0.65*USL = 0x82 @3.3V
  set_register(0x5A, ATO_CFGT, 0xB5);*/  // Target = 0.9*USL = 0xB5 @3.3V
  set_register(0x5A, ELE_CFG, 0x0C);
}


boolean checkInterrupt(void) {
  return digitalRead(irqpin);
}


void set_register(int address, unsigned char r, unsigned char v) {
  Wire.beginTransmission(address);
  Wire.write(r);
  Wire.write(v);
  Wire.endTransmission();
}

// LED Functions
void setColor(int red, int green, int blue)
{
  #ifdef COMMON_ANODE
    red = 255 - red;
    green = 255 - green;
    blue = 255 - blue;
  #endif
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);  
}
