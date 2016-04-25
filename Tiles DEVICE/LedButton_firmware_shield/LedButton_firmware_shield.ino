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

#define RED_LED_PIN 2
#define GREEN_LED_PIN 3
#define BLUE_LED_PIN 4
#define BUTTON_A_PIN 5
#define BUTTON_B_PIN 6

//EVENTS
//debounce time (in ms)
int debounce_time = 10;
//maximum debounce timeout (in ms)
int debounce_timeout = 100;
//setup text messages to be sent out
const char btnA[] = "buttonA,touch";
const char btnB[] = "buttonB,touch";

//COMMANDS
int ledState = LOW;             // ledState used to set the LED
unsigned long previousMillis = 0;        // will store last time LED was updated
bool blinking = 0; 
String blinkingColor;

void setup() {
  //Setup IO PINs
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT);
  pinMode(BUTTON_A_PIN, INPUT);
  pinMode(BUTTON_B_PIN, INPUT);

  //blink the LEDS to test they are actually working
  digitalWrite(GREEN_LED_PIN, HIGH);
  digitalWrite(RED_LED_PIN, HIGH);
  digitalWrite(BLUE_LED_PIN, HIGH);
  delay(500);
  digitalWrite(GREEN_LED_PIN, LOW);
  digitalWrite(RED_LED_PIN, LOW);
  digitalWrite(BLUE_LED_PIN, LOW);

  //Start serial interface (over USB) for debugging purposes
  Serial.begin(9600);

  //Setup Bluetooth Connectivity
  //set the device name
  RFduinoBLE.deviceName = "RFduino";
  //set the data we want to appear in the advertisement (max 31bytes)
  RFduinoBLE.advertisementData = "RFduino";
  //set advertising interval in ms (low-longer battery life)
  RFduinoBLE.advertisementInterval = 200;
  //set tx signal strenght (value between -30 and +4dDm in 4dBm increments)
  RFduinoBLE.txPowerLevel = -20;
  //start the BLE stack
  RFduinoBLE.begin();

  RFduino_pinWake(BUTTON_A_PIN, HIGH);
  RFduino_pinWake(BUTTON_B_PIN, HIGH);
}


void loop() {
  //do
    // switch to lower power mode until a button edge wakes us up
  //  RFduino_ULPDelay(INFINITE);
  //while (! debounce());
  if (RFduino_pinWoke(BUTTON_A_PIN))
  {
    Serial.println("Button A pressed!");
    RFduinoBLE.send(btnA, 13);
    RFduino_resetPinWake(BUTTON_A_PIN);
  }
  if (RFduino_pinWoke(BUTTON_B_PIN))
  {
    Serial.println("Button B pressed!");
    RFduinoBLE.send(btnB, 13);
    RFduino_resetPinWake(BUTTON_B_PIN);
  }
 if(blinking)
  blink(blinkingColor);
}

void RFduinoBLE_onConnect()
{
  digitalWrite(GREEN_LED_PIN, HIGH);
}

void RFduinoBLE_onDisconnect()
{
  digitalWrite(GREEN_LED_PIN, LOW);
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
  }

}

int debounce()
{
  int start = millis();
  int debounce_start = start;
  while (millis() - start < debounce_timeout)
    if (digitalRead(BUTTON_A_PIN) || digitalRead(BUTTON_B_PIN))
    {
      if (millis() - debounce_start >= debounce_time)
        return 1;
    }
    else
      debounce_start = millis();
  return 0;
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
