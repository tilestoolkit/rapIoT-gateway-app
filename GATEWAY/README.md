# Tiles gateway

## Setting up project environment
To set up the project, clone the repository and navigate into the gateway folder:
`$ git clone git@github.com:nornes/tiles-rapIoT.git`
`$ cd tiles-rapIoT/GATEWAY`
Install the required global npm packages:
`$ npm install -g angular-cli ionic cordova tslint
Install the local npm packages with
`$ yarn install`
or
`$ npm install`

## Running the app
### Browser
The app runs using either npm commands or the ionic cli. To run the app in the browser (mind that the browser does not have support for cordova, so the BLE results will be mock data) use
`$ ionic serve -l`
This will open up a browser window with the possibility to view the app on IOS, Android and Windows phone.

### On a device
To run the app on a device you have to have android studio for android or xcode and a mac for IOS.
Install the cordova platform for your device with the command
`$ ionic platform add <platform>`
where platform is either ios or android. Other platforms are also available, but we are not focusing on making the app work on these.
Connect your phone to the computer by the usb cord and run
`$ ionic run <platform>`
This should open the app on your phone.
You can also add the -l flag to trigger hot reloading, but this has been known to cause some problems from Ionic's side.
NB! Note that apple is strict when it comes to accessing the native components of the phone, so many of the native components of the code, amongst them the BLE will not work. You can circumvent this by using the [Ionic view](http://view.ionic.io/) app instead, following [this guide](https://docs.ionic.io/tools/view/).

### Problems
When using `$ ionic serve` or `$ ionic run <platform> -l` you might run into troubles with the API not working. This is because of CORS and can be solved by using only `$ ionic run <platform>` without the live reloading for running it on a simulator/mobile or by downloading the chrome extension [Allow-Control-Allow-Origin: *](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi) for the browser.

## Building an andoid apk
To create a version of the application, use `$ ionic build android`. This will create a debug apk, which will work with all the same functionallity of a production app, but takes a bit more space than a production app. 

## Before making a pull request
We are using travis as a tool for CI to make sure the contributing code does not break any tests and is linted according to the linting rules. Before making a pull request check that these are ok by running the commands:
`$ npm test`
and
`$ npm run lint`
