/*
  TILES Test Led Button
  Example of how Bluetooth 4.0 communication. It works with custom-made button, red led, green led shield.
  HOWTOV01: Use a BT client to subscribe to characteristic 2221 events btnON, btnOFF. (tested with lightblue client on mac https://itunes.apple.com/us/app/lightblue)
  Green LED turns on when TILE is connecteed to a BT client.
  Red LED can be controlled by the client by sending the events "ledON" (or the HEX 0x01 as alternative) and "ledOFF" (or the HEX 0x00 as alternative).

  V.01 - 150915 - Simone Mora (simonem@ntnu.no)
  V.02 - 050215 - Simone Mora (simonem@ntnu.no)
  - added multiple event and command handling
  -RFDUINO LED BUTTON SHIELD VERSION-
*/

#include <RFduinoBLE.h>
#include <LEDFader.h>
#include <Wire.h>
//#include <WInterrupts.h>
#include <stdlib.h>

 #include <TokenSoloEvent.h>
//#include "libs/TS/TokenSoloEvent.h"
// Variables for Token Solo Event
volatile uint8_t intSource = 0; // byte with interrupt informations
adxl345_activity_t event;
int tab[] = {'0', '0'};
int single_tap = 0;
int double_tap = 0;
int shake = 0;
int inactivity = 0;
bool tilt = false;

#define is_shield true  // Used to define pins for RFduino shield or TILES Square

#if is_shield
#define RED_LED_PIN 2
#define GREEN_LED_PIN 3
#define BLUE_LED_PIN 4
#define VIBRO_PIN 0
#define ACC_INT1_PIN 1 // Pin where the acceleromter interrupt1 is connected
#else
#define RED_LED_PIN 0
#define GREEN_LED_PIN 1
#define BLUE_LED_PIN 2
#define VIBRO_PIN 3
#define ACC_INT1_PIN 4 // Pin where the acceleromter interrupt1 is connected
#endif

TokenSoloEvent tokenSolo = TokenSoloEvent(ACC_INT1_PIN); // Connected on pin 4
String event_name;
String payload;
char c_payload[19];

#define COMMON_ANODE

#define FADE_TIME 2000
#define DIR_UP 1
#define DIR_DOWN -1
LEDFader fade_red;
LEDFader fade_green;
LEDFader fade_blue;
int direction = DIR_UP;
bool fading = 0;

String adv_name;
String mac;
uint8_t *deviceADDR0 = (uint8_t *)0x100000a4; // location of MAC address last byte
char adv_name_c[8];

int interrupt_count = 0;

//COMMANDS
int ledState = LOW;                       // ledState used to set the LED
unsigned long previousMillis = 0;        // will store last time LED was updated
bool blinking = 0;
String blinkingColor;
String fadingColor;


int acc_event(uint32_t ulPin){
  uint8_t data = tokenSolo.accel.readRegister(ADXL345_REG_INT_SOURCE);
   
  if((data >> ADXL345_FREE_FALL) & 1){
    payload = adv_name + ",drop";
    payload.toCharArray(c_payload, 19);
    RFduinoBLE.send((char*) c_payload, 19);
    return 0;
  }

  if((data >> ADXL345_DOUBLE_TAP) & 1){
    payload = adv_name + ",tap,double";
    payload.toCharArray(c_payload, 19);
    RFduinoBLE.send((char*) c_payload, 19);
    return 0;
  }

  if((data >> ADXL345_SINGLE_TAP) & 1){
    payload = adv_name + ",tap,single";
    payload.toCharArray(c_payload, 19);
    RFduinoBLE.send((char*) c_payload, 19);
    return 0;
  }
  
}

void setup() {
  // Config of the accelerometer
  tokenSolo.accelConfig();

  //Define adv name
  mac = String(*deviceADDR0, HEX);
  adv_name = "Tile_" + mac;
  adv_name.toCharArray(adv_name_c, 8);

  //Setup IO PINs
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT);
  pinMode(VIBRO_PIN, OUTPUT);

  RFduino_pinWakeCallback(ACC_INT1_PIN, HIGH, acc_event);

  //blink the LEDS to test they are actually working
  digitalWrite(GREEN_LED_PIN, LOW);
  delay(250);
  digitalWrite(RED_LED_PIN, LOW);
  delay(250);
  digitalWrite(BLUE_LED_PIN, LOW);
  delay(500);
  digitalWrite(GREEN_LED_PIN, HIGH);
  digitalWrite(RED_LED_PIN, HIGH);
  digitalWrite(BLUE_LED_PIN, HIGH);

  //Setup Bluetooth Connectivity
  //set the device name
  RFduinoBLE.deviceName = adv_name_c;
  //set the data we want to appear in the advertisement (max 31bytes)
  RFduinoBLE.advertisementData = adv_name_c;
  //set advertising interval in ms (low-longer battery life)
  RFduinoBLE.advertisementInterval = 200;
  //set tx signal strenght (value between -30 and +4dDm in 4dBm increments)
  RFduinoBLE.txPowerLevel = -20;
  //start the BLE stack
  RFduinoBLE.begin();

  fade_red = LEDFader(RED_LED_PIN);
  fade_green = LEDFader(GREEN_LED_PIN);
  fade_blue = LEDFader(BLUE_LED_PIN);
}


void loop() {
  /************************************************************/
 
  if (abs(tokenSolo.accelGetX()) > 7 || abs(tokenSolo.accelGetY()) > 7){
    payload = adv_name + ",tilt";
    payload.toCharArray(c_payload, 19);
    RFduinoBLE.send((char*) c_payload, 19);
  }
  
  if (inactivity)
  {
    //tokenConstraint.rgb_sensor.getData();
  }

  if (blinking)
    blink(blinkingColor);

  if (fading) {
    fade(fadingColor);
  }

//  delay(500); // Important delay, do not delete it !
  RFduino_ULPDelay(1000);
}

void RFduinoBLE_onConnect()
{
  digitalWrite(GREEN_LED_PIN, HIGH);
  delay(500);
  digitalWrite(GREEN_LED_PIN, LOW);
}

void RFduinoBLE_onDisconnect()
{
  digitalWrite(GREEN_LED_PIN, LOW);
}

void RFduinoBLE_onAdvertisement() {
  digitalWrite(RED_LED_PIN, HIGH);
}

//Callback when a data chunk is received. OBS! Data chunks must be 20KB (=20 ASCII characters) maximum!
void RFduinoBLE_onReceive(char *data, int len)
{
  //TODO verify whether the payload variable has to be deallocated to avoid memory leaks
  // char payload[6];
  // strncpy(payload,data,len);

  //debugging data packet received
//  Serial.println("Data received");
//  Serial.print("Packet lenght: "); Serial.println(len);
//  Serial.print("Payload: "); Serial.println(data);

  String command;
  command = data;
  command = command.substring(0, len);

  int commaIndex = command.indexOf(',');
  //  Search for the next comma just after the first
  int secondCommaIndex = command.indexOf(',', commaIndex + 1);

  String firstValue = command.substring(0, commaIndex);
  String secondValue = command.substring(commaIndex + 1, secondCommaIndex);
  String thirdValue = command.substring(secondCommaIndex + 1);

//  Serial.print("Command: "); Serial.println(command);
//  Serial.print("FirstValue: "); Serial.println(firstValue);
//  Serial.print("SecondValue: "); Serial.println(secondValue);
//  Serial.print("ThirdValue: "); Serial.println(thirdValue);

  if (firstValue == "led") {
    if (secondValue == "off") {
      blinking = 0;
      fading = 0;
      setColor("off");
    }
    else if (secondValue == "on")
    {
      blinking = 0;
      fading = 0;
      setColor(thirdValue);
    }
    else if (secondValue == "blink")
    {
      fading = 0;
      blinking = 1;
      blinkingColor = thirdValue;
    }
    else if (secondValue == "fade") {
      blinking = 0;
      fading = 1;
      fadingColor = thirdValue;
    }
  }
  else if (firstValue == "haptic") {
    if (secondValue == "long") {
      haptic("long");
    } else if (secondValue == "burst") {
      haptic("burst");
    }
  }
}




// LED Functions
void setColor(String color)
{
  if (color == "off")
    setColorRGB(0, 0, 0);
  else if (color == "red")
    setColorRGB(255, 0, 0);
  else if (color == "green")
    setColorRGB(0, 255, 0);
  else if (color == "blue")
    setColorRGB(0, 0, 255);
  else if (color == "white")
    setColorRGB(255, 255, 255);
  else if (color.length() == 6) {
    int red, green, blue;
    parseColorString(color, red, green, blue);
    setColorRGB(red, green, blue);
  }
}

void parseColorString(String color, int& red, int& green, int& blue) {
  unsigned int colorHex = strtol(&color[0], NULL, 16);
  red = (int)((colorHex >> 16) & 0xFF);  // Extract the RR byte
  green = (int)((colorHex >> 8) & 0xFF); // Extract the GG byte
  blue = (int)((colorHex) & 0xFF);       // Extract the BB byte
}


void setColorRGB(int red, int green, int blue)
{
#ifdef COMMON_ANODE
  red = 255 - red;
  green = 255 - green;
  blue = 255 - blue;
#endif
  analogWrite(RED_LED_PIN, red);
  analogWrite(GREEN_LED_PIN, green);
  analogWrite(BLUE_LED_PIN, blue);
}

void blink(String color)
{
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= 500) {
    // save the last time you blinked the LED
    previousMillis = currentMillis;
    // if the LED is off turn it on and vice-versa:
    if (ledState == LOW) {
      ledState = HIGH;
    } else {
      ledState = LOW;
    }
    // set the LED with the ledState of the variable:
    if (ledState == LOW)
      setColor("off");
    else
      setColor(color);
  }
}

void haptic(String pattern)
{
  if (pattern == "long")
  {
    digitalWrite(VIBRO_PIN, HIGH);
    delay(1500);
    digitalWrite(VIBRO_PIN, LOW);
  }
  else if (pattern == "burst") {
    for (int i = 0; i < 4; i++)
    {
      digitalWrite(VIBRO_PIN, HIGH);
      delay(150);
      digitalWrite(VIBRO_PIN, LOW);
      delay(150);
    }
  }
}

void fade(String color) {
  fade_blue.update();
  // LED no longer fading, switch direction
  if (!fade_blue.is_fading()) {
    // Fade down
    if (direction == DIR_UP) {
      fade_blue.fade(0, FADE_TIME);
      direction = DIR_DOWN;
    }
    // Fade up
    else {
      fade_blue.fade(255, FADE_TIME);
      direction = DIR_UP;
    }
  }
}
