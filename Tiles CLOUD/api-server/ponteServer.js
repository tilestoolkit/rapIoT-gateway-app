var ponte = require("ponte");

var tilesAscoltatore = require("./tiles_ascoltatore");

var opts = {
  logger: {
    level: 'info'
  },
  broker: {
    type: tilesAscoltatore
  },
  http: {
    port: 8080 // tcp
  },
  mqtt: {
    port: 1883 // tcp
  },
  coap: {
    port: 5683 // udp
  },
  persistence: {
    type: 'mongo',
    url: 'mongodb://localhost:27017/ponte'
  }
};
var server = ponte(opts);

server.on("updated", function(resource, buffer) {
  console.log("Resource Updated", resource, buffer);
});

// Stop the server after 1 minute
/*setTimeout(function() {
  server.close(function() {
    console.log("server stopped");
  });
}, 60 * 1000);*/

module.exports = server;