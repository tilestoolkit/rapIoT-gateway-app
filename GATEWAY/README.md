#Setup guide:


### Clone the project

`$ cd tiles-rapIoT/GATEWAY`

`$ npm install`

### Install cross-platform tools for CLI-commands (Needed to build and test the solution)
(This is needed because the development-team works on both IOS and Windows, and needed a copy-command that works on both platforms)

`$ npm install -g cd-cli`

## Running the app
Now there are a few possible ways to run the app. The simplest is to run the ionic lab which gives you a collective view of how the app will look on different mobile platforms. This is done by running: 
`$ ionic serve -l`
You will notice a runtime-error message saying cordova is not available, but this can be closed in the top right corner. This is caused by the browser not being able to run cordova plugins. 


To avoud this runtime-error you can run the app on different emulator platforms. To do this you first have to install the cordova platform: 
`$ cordova platform add <platform>` 
There are a lot of possible platforms to choose from, but for this projects we use ios, android and browser. 
With the platform added run 
`$ ionic run <platform>`

When using `ionic serve` or `ionic run <platform> -l` you might run into troubles with the api not working. This is because of CORS and can be solved by using onli `ionic run <platform>` withour the live reloading for running it on a simulator/mobile or by downloading the chrome extension [Allow-Control-Allow-Origin: *](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi)
