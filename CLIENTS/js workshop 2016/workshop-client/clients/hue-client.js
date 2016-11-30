var hue = require('node-hue-api'),
  HueApi = hue.HueApi,
  LightState = hue.lightState;


var client = function (username) {
  var client = this;
  client.HueApi = HueApi;
  client.LightState = LightState;


  client.username = username;
  var displayBridges = function (b) {
    client.bridge = b[0];
    client.api = new client.HueApi(client.bridge.ipaddress, client.username);
  }

  hue.nupnpSearch().then(displayBridges).done();
}


client.prototype.setColor = function (ids, color) {
  var client = this;
  if (ids.constructor !== Array) {
    ids = [ids];
  }
  ids.forEach(function (id) {
    if (!client) return;

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    var r = result ? parseInt(result[1], 16) : null;
    var g = result ? parseInt(result[2], 16) : null;
    var b = result ? parseInt(result[3], 16) : null;

    if (r == null || b == null || g == null) {
      return;
    }
    var state = client.LightState.create().on().rgb(r, g, b);
    client.api.setLightState(id, state);
  });
};

client.prototype.switchOff = function (ids) {
  var client = this;
  if (ids.constructor !== Array) {
    ids = [ids];
  }
  ids.forEach(function (id) {
    var state = client.LightState.create().off();
    client.api.setLightState(id, state);
  });
}

client.prototype.switchOn = function (ids) {
  var client = this;
  if (ids.constructor !== Array) {
    ids = [ids];
  }
  ids.forEach(function (id) {
    var state = client.LightState.create().on();
    client.api.setLightState(id, state);
  });
}

client.prototype.colorLoop = function (ids) {
  var client = this;
  if (ids.constructor !== Array) {
    ids = [ids];
  }
  ids.forEach(function (id) {
    var state = client.LightState.create().on().colorLoop();
    client.api.setLightState(id, state);
  });
}

client.prototype.randomColor = function (ids) {
  var client = this;
  if (ids.constructor !== Array) {
    ids = [ids];
  }
  ids.forEach(function (id) {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);

    var state = client.LightState.create().on().rgb(r, g, b);
    client.api.setLightState(id, state);
  });
}

client.prototype.blink = function (ids) {
  var client = this;
  if (ids.constructor !== Array) {
    ids = [ids];
  }
  ids.forEach(function (id) {
    var state = client.LightState.create().longAlert();
    client.api.setLightState(id, state);
  });
}

client.prototype.toggle = function (ids) {
  var client = this;
  if (ids.constructor !== Array) {
    ids = [ids];
  }
  ids.forEach(function (id) {
    client.api.lightStatus(id)
      .then(function (res, err) {
        if (res.state.on === true) {
          client.switchOff(id);
        } else {
          client.switchOn(id);
        }
      }).done();
  });
}

module.exports = client;