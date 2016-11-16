'use strict';
var request = require('request');

var IFTTTClient = function (secret) {
  this.personalSecret = secret;
}

IFTTTClient.prototype.send = function (triggerName) {
  var url = 'http://maker.ifttt.com/trigger/' + triggerName + '/with/key/' + this.personalSecret;
  request.post(
    { url: url },
    function (error, response, body) {
      if (error) {
        console.log("IFTTTClient error in post");
      }
    });
}
module.exports = IFTTTClient;