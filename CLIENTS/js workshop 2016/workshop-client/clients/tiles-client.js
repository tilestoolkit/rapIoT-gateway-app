'use strict';

var mqtt = require('mqtt');
var util = require('util');
var http = require('http');
var EventEmitter = require('events').EventEmitter;

var tag = '[TILES Client]';

var defaults = {
  host: 'test.mosquitto.org',
  port: typeof window === 'undefined' ? 1883 : 8080 // If running in a browser -> Use standard WebSocket port
}

function TilesClient(username, host, port) {
  this.mqttClient = null;
  this.isConnected = false;
  this.username = username;
  this.host = host || defaults.host;
  this.port = port || defaults.port;
  this.tiles = {};
}

TilesClient.prototype.__proto__ = EventEmitter.prototype;

TilesClient.prototype.setServerConnectionStatus = function(msg, isConnected) {
  console.log(tag, msg);
  this.isConnected = isConnected;
}

TilesClient.prototype.connect = function(username) {
  this.mqttClient = mqtt.connect({host: this.host, port: this.port});
  this.setServerConnectionStatus('Connecting...', false);

  var that = this;

  this.mqttClient.on('connect', function() {
    that.setServerConnectionStatus('Successfully connected to server', true);
    that.mqttClient.subscribe('tiles/evt/' + that.username + '/+');
    that.mqttClient.subscribe('tiles/evt/' + that.username + '/+/active');
    that.mqttClient.subscribe('tiles/evt/' + that.username + '/+/name');
    that.emit('connect');
  });

  this.mqttClient.on('offline', function() {
    that.setServerConnectionStatus('Client gone offline', false);
  });

  this.mqttClient.on('close', function() {
    that.setServerConnectionStatus('Disconnected from server', false);
  });

  this.mqttClient.on('reconnect', function() {
    that.setServerConnectionStatus('A reconnect is started', false);
  });

  this.mqttClient.on('error', function(error) {
    console.log(tag, 'Error: ' + error);
  });

  this.mqttClient.on('message', function(topic, message) {
    var splitTopic = topic.split('/');
    var tileId = splitTopic[3];
    if (splitTopic[4] === 'active'){
      var tileChange = (message.toString() === 'true') ? 'tileRegistered' : 'tileUnregistered';
      that.emit(tileChange, tileId);
    } else if (splitTopic[4] === 'name'){
      that.tiles[message.toString()] = tileId;
    } else {
      try {
        var eventObj = JSON.parse(message);
        that.emit('receive', tileId, eventObj);
      } catch (error) {
        console.log(tag, 'Error: ' + error);
      }
    }
  });

  return this;
}

TilesClient.prototype.send = function(tileId, propertyName) {
  if (tileId === undefined) {
    console.log(tag, 'Can\'t send command. Tile ID is undefined.');
    return;
  } else if (propertyName === undefined) {
    console.log(tag, 'Can\'t send command. Property name is undefined.');
    return;
  }

  var msg = {
    name: propertyName,
    properties: Array.prototype.slice.call(arguments, 2)
  }

  if (this.isConnected){
    this.mqttClient.publish('tiles/cmd/' + this.username + '/' + tileId, JSON.stringify(msg));
  } else {
    console.log(tag, 'Client is not connected!');
  }
}

TilesClient.prototype.retrieveTileIdByName = function(name, callback) {
  http.get('http://'+this.host+':3000/users/'+this.username+'/tiles/name/'+name, function(res) {
    console.log('Got response: ${res.statusCode}');

    // Continuously update stream with data
    var body = '';
    res.on('data', function(d) {
        body += d;
    });

    res.on('end', function() {
        // Data reception is done
        var tile = JSON.parse(body);
        console.log('Retrieved tile: '+JSON.stringify(tile));
        callback(tile._id);
    });

  }).on('error', function(e) {
    console.log('Got error: ${e.message}');
  });
}

TilesClient.prototype.ls = function(callback) {
  http.get('http://'+this.host+':3000/users/'+this.username+'/tiles', function(res) {
    console.log('Got response: ${res.statusCode}');

    // Continuously update stream with data
    var body = '';
    res.on('data', function(d) {
        body += d;
    });

    res.on('end', function() {
        // Data reception is done
        var tiles = JSON.parse(body);
        callback(tiles);
    });

  }).on('error', function(e) {
    console.log('Got error: ${e.message}');
  });
}

TilesClient.prototype.sendJson = function(json){
  if (this.isConnected){
    var tileId = JSON.parse(json).id;
    console.log(JSON.parse(json));
    this.mqttClient.publish('tiles/cmd/' + this.username + '/' + tileId, json);
  } else {
    console.log(tag, 'Client is not connected!');
  }
}

module.exports = TilesClient;
