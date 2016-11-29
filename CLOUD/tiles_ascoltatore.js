"use strict";

var AbstractAscoltatore = require("ascoltatori/lib/abstract_ascoltatore");
var util = require("ascoltatori/lib/util");
var defer = util.defer;
var debug = require("debug")("ascoltatori:trie");
var Qlobber = require("qlobber").Qlobber;
var ascoltatori = require('ascoltatori/lib/ascoltatori');

var TilesApi = require('./tiles_api');

var tag = '[TILES Ascoltatore]'; // Log tag

function arrayBufferToString(buf){
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function TilesAscoltatore(settings) {
  AbstractAscoltatore.call(this, settings);

  settings = settings || {};

  this._matcher = new Qlobber({
    separator: settings.separator || '/',
    wildcard_one: settings.wildcardOne || '+',
    wildcard_some: settings.wildcardSome || '*'
  });

  this._matcher.add('tiles/evt/+/+/active', function(topic, message, options){
    var splitTopic = topic.split('/');
    var username = splitTopic[2];
    var deviceId = splitTopic[3];
    var active = (arrayBufferToString(message) === 'true');
    console.log(tag + "Set active state for " + deviceId + ": " + active);
    TilesApi.setDeviceState(deviceId, username, null, active);
  });

  this._matcher.add('tiles/evt/+/+/name', function(topic, message, options){
    var splitTopic = topic.split('/');
    var username = splitTopic[2];
    var deviceId = splitTopic[3];
    var name = arrayBufferToString(message);
    console.log(tag + "Register device with ID: " + deviceId + " and name: " + name);
    TilesApi.setDeviceState(deviceId, username, null, null, name);
  });

  this._matcher.add('tiles/evt/+/+', function(topic, message, options){
    var splitTopic = topic.split('/');
    var username = splitTopic[2];
    var deviceId = splitTopic[3];
    var state = arrayBufferToString(message);
    console.log(tag + "Set event state for " + deviceId + ": " + state);
    TilesApi.setDeviceState(deviceId, username, state, null);
  });

  this.emit("ready");
}

TilesAscoltatore.prototype = Object.create(AbstractAscoltatore.prototype);

TilesAscoltatore.prototype.subscribe = function subscribe(topic, callback, done) {
  this._raiseIfClosed();
  debug("registered new subscriber for topic " + topic);
  console.log(tag + " Registered new subscriber for topic '" + topic + "'");

  this._matcher.add(topic, callback);
  defer(done);
};

TilesAscoltatore.prototype.publish = function (topic, message, options, done) {
  this._raiseIfClosed();
  debug("new message published to " + topic);
  console.log("[TILES Ascoltatore] Message published to topic '"+topic+"': "+message);

  var cbs = this._matcher.match(topic);

  for (var i = 0; i < cbs.length; i++) {
    cbs[i](topic, message, options);
  }

  defer(done);
};

TilesAscoltatore.prototype.unsubscribe = function unsubscribe(topic, callback, done) {
  this._raiseIfClosed();

  debug("deregistered subscriber for topic " + topic);
  console.log(tag + " Deregistered subscriber for topic '" + topic + "'");

  this._matcher.remove(topic, callback);

  defer(done);
};

TilesAscoltatore.prototype.close = function close(done) {
  this._matcher.clear();
  this.emit("closed");

  debug("closed");
  console.log(tag + " Closed");

  defer(done);
};

TilesAscoltatore.prototype.registerDomain = function(domain) {
  debug("registered domain");
  console.log(tag + " Registered domain: " + domain);

  if (!this._publish) {
    this._publish = this.publish;
  }

  this.publish = domain.bind(this._publish);
};

util.aliasAscoltatore(TilesAscoltatore.prototype);

module.exports = TilesAscoltatore;