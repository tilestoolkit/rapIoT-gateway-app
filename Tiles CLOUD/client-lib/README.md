# Tiles Client Library

## Browser

### Browserify

In order to use this client library in a browser, [Browserify](https://github.com/substack/node-browserify) can be used to create a stand-alone build.

```sh
cd "Tiles CLOUD/client-lib"
npm install // Install dependencies
npm install -g browserify // Install Browserify globally
browserify tiles-client.js -s TilesClient > browserTilesClient.js
```

The generated module is AMD/CommonJS compatible. If no module system is found, an object ``TilesClient`` is added to the global namespace, which makes it accessible from the browser.