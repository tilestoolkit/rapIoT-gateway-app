'use strict';
var request = require('request');

var IFTTTClient = function (secret) {
  this.personalSecret = secret;
}

IFTTTClient.prototype.send = function (triggerName, value1, value2, value3) {
  var url = 'http://maker.ifttt.com/trigger/' + triggerName + '/with/key/' + this.personalSecret;
  request.post(
    {
      url: url,
      form: { value1: value1, value2: value2, value3: value3 }
    },
    function (error, response, body) {
      if (error) {
        console.log("IFTTTClient error in post");
      }
    });
}
module.exports = IFTTTClient;