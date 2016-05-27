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
#define FADE_TIME 2000
#define DIR_UP 1
#define DIR_DOWN -1
LEDFader fade_green;
LEDFader fade_red;
LEDFader fade_blue;
int direction = DIR_UP;
bool fading = 0;

String adv_name;
String mac;
uint8_t *deviceADDR0 = (uint8_t *)0x100000a4; // location of MAC address last byte
char adv_name_c[8];


#define RED_LED_PIN 0
#define GREEN_LED_PIN 1
#define BLUE_LED_PIN 2
#define VIBRO_PIN 3

//COMMANDS
int ledState = LOW;                       // ledState used to set the LED
unsigned long previousMillis = 0;        // will store last time LED was updated
bool blinking = 0; 
String blinkingColor;

void setup() {
  //Define adv name
  mac = String(*deviceADDR0,HEX);
  adv_name = "Tile_" + mac;
  adv_name.toCharArray(adv_name_c,8);

  //Setup IO PINs
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT);
  pinMode(VIBRO_PIN, OUTPUT);

  //blink the LEDS to test they are actually working
  digitalWrite(GREEN_LED_PIN, HIGH);
  delay(250);
  digitalWrite(RED_LED_PIN, HIGH);
  delay(250);
  digitalWrite(BLUE_LED_PIN, HIGH);
  delay(500);
  digitalWrite(GREEN_LED_PIN, LOW);
  digitalWrite(RED_LED_PIN, LOW);
  digitalWrite(BLUE_LED_PIN, LOW);

  //Start serial interface (over USB) for debugging purposes
  //Serial.begin(9600);

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

  fade_green = LEDFader(GREEN_LED_PIN);
  fade_red = LEDFader(RED_LED_PIN);
  fade_blue = LEDFader(BLUE_LED_PIN);

  
}


void loop() {
 if(blinking)
  blink(blinkingColor);
  if(fading){
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

void RFduinoBLE_onAdvertisement(){
  digitalWrite(RED_LED_PIN, HIGH);  
}

//Callback when a data chunk is received. OBS! Data chunks must be 20KB (=20 ASCII characters) maximum!
void RFduinoBLE_onReceive(char *data, int len)
{
  //TODO verify whether the payload variable has to be deallocated to avoid memory leaks
  // char payload[6];
  // strncpy(payload,data,len);

  //debugging data packet received
  Serial.println("Data received");
  Serial.print("Packet lenght: "); Serial.println(len);
  Serial.print("Payload: "); Serial.println(data);

  String command;
  command = data;
  command = command.substring(0, len);

  int commaIndex = command.indexOf(',');
  //  Search for the next comma just after the first
  int secondCommaIndex = command.indexOf(',', commaIndex + 1);

  String firstValue = command.substring(0, commaIndex);
  String secondValue = command.substring(commaIndex + 1, secondCommaIndex);
  String thirdValue = command.substring(secondCommaIndex + 1);

  Serial.print("Command: "); Serial.println(command);
  Serial.print("FirstValue: "); Serial.println(firstValue);
  Serial.print("SecondValue: "); Serial.println(secondValue);
  Serial.print("ThirdValue: "); Serial.println(thirdValue);

  if (firstValue == "led") {
    if (secondValue == "off"){
      setColor("off");
      blinking = 0;
      fading = 0;
    }
    else if (secondValue == "on")
    {
      setColor(thirdValue);
      blinking = 0;
    }
    else if (secondValue == "blink")
    {
      blinking = 1;
      blinkingColor = thirdValue;
    }
    else if (secondValue == "fade"){
      fading = 1;
    }
    } 
  else if(firstValue == "haptic"){
    if (secondValue == "long"){
      haptic("long");
    } else if(secondValue == "burst"){
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
  if(pattern == "long")
  {
    digitalWrite(VIBRO_PIN,HIGH);
    delay(1500);
    digitalWrite(VIBRO_PIN,LOW);
  }
  else if(pattern == "burst"){
    for(int i = 0; i<4; i++)
    {
    digitalWrite(VIBRO_PIN,HIGH);
    delay(150);
    digitalWrite(VIBRO_PIN,LOW);
    delay(150);
    }
  }  
}

void fade(String color){
}



