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