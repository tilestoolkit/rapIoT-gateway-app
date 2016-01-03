# Tiles Mobile Application

### Installation

First, install [Node.js](http://nodejs.org/). Then, install the latest Cordova and Ionic [command-line tools](https://www.npmjs.com/package/ionic):

```sh
$ npm install -g cordova
$ npm install -g ionic
```

Change directory to "Tiles MOBILE":
```sh
$ cd "Tiles MOBILE"
```

Now, we need to tell Ionic that we want to enable the Android and iOS platforms. Note: Unless you are on Mac OS, leave out the iOS platform:
```sh
$ ionic platform add android
$ ionic platform add ios
```

Update Ionic library files:
```sh
$ ionic lib update
```

Load plugins:
```sh
$ ionic state restore --plugins
```

### Run application
Deploy the Ionic app on specified platform devices. If a device is not found it'll then deploy to an emulator/simulator:
```sh
$ ionic run [android|ios]
```
To build native project for the target platform. Projects will be compiled in the /platform dir
```sh
$ ionic build [android|ios]
```

#### iOS Only
- Run the XCODE project from the /platform dir. You will need a valid provisioning profile. Since 2015 you can get a free, limited provisioning profile see [Free provisining profile](https://developer.xamarin.com/guides/ios/getting_started/installation/device_provisioning/free-provisioning/)
- Once the App in installed, in case you get an "Untrusted developer" warning, go to Settings - General - Device Management, tap on your Profile then tap on Trust button.

#### Tiles Connection
- Turn on Bluetooth.
- In the app, use pull-to-refresh or the 'Refresh'-button to refresh the list of nearby Bluetooth devices
- When the Tile device is discovered, click 'Connect'.
- You'll now be presented with a switch to control the LED Light on the Tile, and an indicator showing whether the physical button on the Tile is pressed or not.

#### Server Connection
- The app automatically connects to Mosquitto's test server/broker if an internet connection is available on the device.
- When a Tile is successfully connected to the phone, it will be able to send and receive messages to/from the server, using the phone as a gateway.
- This functionality can be tested using a tool such as [MQTTlens](https://chrome.google.com/webstore/detail/mqttlens/hemojaaeigabkbcookmlgmdigohjobjm):
  - Set up a connection to Mosquitto's test server (Hostname: tcp://test.mosquitto.org, Port: 1883).
  - Subscribe to the topic 'Tiles'.
  - Now, whenever the button on the Tile is pressed or released, a JSON formatted string, containing the event, will be sent to the MQTT broker and the message will show up in MQTTlens.
  - To swith on the light on the Tile, from the server, publish a message to the topic 'Tiles' in the following format: 
  ```json
  {"id": "[Device ID]", "activation": "on"}
  ```
