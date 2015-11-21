'use strict';

var mqtt = require('mqtt');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var host = 'mqtt://test.mosquitto.org';
var tag = '[TILES Client]';

function TilesClient(username){
  this.mqttClient = null;
  this.isConnected = false;
  this.username = username;
}

TilesClient.prototype.__proto__ = EventEmitter.prototype;

TilesClient.prototype.setServerConnectionStatus = function(msg, isConnected){
  console.log(tag, msg);
  this.isConnected = isConnected;
}

TilesClient.prototype.connect = function(username) {
  this.mqttClient = mqtt.connect(host);
  this.setServerConnectionStatus('Connecting...', false);

  var that = this;

  this.mqttClient.on('connect', function(){
    that.setServerConnectionStatus('Successfully connected to server', true);
    that.mqttClient.subscribe('tiles/' + that.username + '/+');
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
    var deviceId = splitTopic[2];
    that.emit('receive', deviceId, message);
  });

  return this;
}

TilesClient.prototype.send = function(deviceId, msg){
  if (this.isConnected){
    this.mqttClient.publish('tiles/'+this.username+'/'+deviceId, msg);
  } else {
    console.log(tag, 'Client is not connected!');
  }
}

module.exports = TilesClient;