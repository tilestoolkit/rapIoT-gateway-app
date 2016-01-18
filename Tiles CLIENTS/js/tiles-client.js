'use strict';

var mqtt = require('mqtt');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var tag = '[TILES Client]';

function TilesClient(username,host,port){
  this.mqttClient = null;
  this.isConnected = false;
  this.username = username;
  this.host=host;
  this.port=port;
}

TilesClient.prototype.__proto__ = EventEmitter.prototype;

TilesClient.prototype.setServerConnectionStatus = function(msg, isConnected){
  console.log(tag, msg);
  this.isConnected = isConnected;
}

TilesClient.prototype.connect = function(username) {
  this.mqttClient = mqtt.connect({host: this.host, port: this.port});
  this.setServerConnectionStatus('Connecting...', false);

  var that = this;

  this.mqttClient.on('connect', function(){
    that.setServerConnectionStatus('Successfully connected to server', true);
    that.mqttClient.subscribe('tiles/evt/' + that.username + '/+');
    that.mqttClient.subscribe('tiles/evt/' + that.username + '/+/active');
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
    } else {
      that.emit('receive', tileId, message);
    }
  });

  return this;
}

TilesClient.prototype.send = function(tileId, msg){
  if (this.isConnected){
    this.mqttClient.publish('tiles/cmd/' + this.username + '/' + tileId, msg);
  } else {
    console.log(tag, 'Client is not connected!');
  }
}

module.exports = TilesClient;
