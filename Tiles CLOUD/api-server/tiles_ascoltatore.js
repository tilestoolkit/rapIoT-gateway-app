"use strict";

var AbstractAscoltatore = require("ascoltatori/lib/abstract_ascoltatore");
var util = require("ascoltatori/lib/util");
var defer = util.defer;
var debug = require("debug")("ascoltatori:trie");
var Qlobber = require("qlobber").Qlobber;
var ascoltatori = require('ascoltatori/lib/ascoltatori');

function TilesAscoltatore(settings) {
  AbstractAscoltatore.call(this, settings);

  settings = settings || {};

  this._matcher = new Qlobber({
    separator: settings.separator || '/',
    wildcard_one: settings.wildcardOne || '+',
    wildcard_some: settings.wildcardSome || '*'
  });

  this.emit("ready");
}

TilesAscoltatore.prototype = Object.create(AbstractAscoltatore.prototype);

TilesAscoltatore.prototype.subscribe = function subscribe(topic, callback, done) {
  this._raiseIfClosed();
  debug("registered new subscriber for topic " + topic);

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

  this._matcher.remove(topic, callback);

  defer(done);
};

TilesAscoltatore.prototype.close = function close(done) {
  this._matcher.clear();
  this.emit("closed");

  debug("closed");

  defer(done);
};

TilesAscoltatore.prototype.registerDomain = function(domain) {
  debug("registered domain");

  if (!this._publish) {
    this._publish = this.publish;
  }

  this.publish = domain.bind(this._publish);
};

util.aliasAscoltatore(TilesAscoltatore.prototype);

module.exports = TilesAscoltatore;