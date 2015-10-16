/*
TILES Test Led Button
Example of how Bluetooth 4.0 communication. It works with custom-made button, red led, green led shield.
HOWTO: Use a BT client to subscribe to characteristic 2221 events btnON, btnOFF. (tested with lightblue client on mac https://itunes.apple.com/us/app/lightblue) 
Green LED turns on when TILE is connecteed to a BT client.
Red LED can be controlled by the client by sending the events "ledON" (or the HEX 0x01 as alternative) and "ledOFF" (or the HEX 0x00 as alternative). 

V.01 - 150915 - Simone Mora (simonem@ntnu.no)
*/

#include <RFduinoBLE.h>

#define GREEN_LED_PIN 2
#define RED_LED_PIN 3
#define BUTTON_PIN 4

//debounce time (in ms)
int debounce_time = 10;

//maximum debounce timeout (in ms)
int debounce_timeout = 100;

//setup text messages to be sent out
const char btnOFF[] = "btnOFF";
const char btnON[] = "btnON";
const char ledOFF[] = "ledOFF";
const char ledON[] = "ledON";

void setup() {
  //Setup IO PINs
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT);
  
  //blink the LEDS to test they are actually working
  digitalWrite(GREEN_LED_PIN, HIGH);
  digitalWrite(RED_LED_PIN, HIGH);
  delay(500);
  digitalWrite(GREEN_LED_PIN, LOW);
  digitalWrite(RED_LED_PIN, LOW);

  //Start serial interface (over USB) for debugging purposes
  Serial.begin(9600);

  //Setup Bluetooth Connectivity 
  //set the device name
  RFduinoBLE.deviceName = "TILES1";
  //set the data we want to appear in the advertisement (max 31bytes) 
  RFduinoBLE.advertisementData = "Tiles1_BTtest";
  //set advertising interval in ms (low-longer battery life)
  RFduinoBLE.advertisementInterval = 200;
  //set tx signal strenght (value between -30 and +4dDm in 4dBm increments)
  RFduinoBLE.txPowerLevel = -20;
  //start the BLE stack
  RFduinoBLE.begin();
}

int debounce(int state)
{
  int start = millis();
  int debounce_start = start;

  while (millis() - start < debounce_timeout)
    if (digitalRead(BUTTON_PIN) == state)
    {
      if (millis() - debounce_start >= debounce_time)
        return 1;
    }
    else
      debounce_start = millis();

  return 0;
}

int delay_until_button(int state)
{
  // set button edge to wake up on
  if (state)
  // this wakes the rfduino up when button is pressed
    RFduino_pinWake(BUTTON_PIN, HIGH);
  else
    RFduino_pinWake(BUTTON_PIN, LOW);
    
  do
    // switch to lower power mode until a button edge wakes us up
    RFduino_ULPDelay(INFINITE);
  while (! debounce(state));
  // after the button is preset this rests the state of the pin that caused the wokeup
  if (RFduino_pinWoke(BUTTON_PIN))
  {
    // execute code here
    RFduino_resetPinWake(BUTTON_PIN);
  }
}

void loop() {
  delay_until_button(HIGH);
  RFduinoBLE.send(btnON,5);

  delay_until_button(LOW);
  RFduinoBLE.send(btnOFF,6);
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
  char payload[6];
  strncpy(payload,data,len);
  
  //debugging data packet received
  Serial.println("Data received");
  Serial.print("Packet lenght: "); Serial.println(len);
  Serial.print("Payload: "); Serial.println(payload);

  if (strcmp(payload,"ledON") == 0 || payload[0] )
    digitalWrite(RED_LED_PIN, HIGH);
  if (strcmp(payload,"ledOFF") == 0 || payload[0] == 0)
    digitalWrite(RED_LED_PIN, LOW);
}
