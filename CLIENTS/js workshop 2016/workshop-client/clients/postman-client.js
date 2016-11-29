'use strict';

var request = require('request');
var PostmanClient = function (ip, port) {
  var self = this;

  self.ip = ip;
  self.port = port;
}

PostmanClient.prototype.get = function (subUrl) {
  var url = 'http://' + self.ip + ':' + self.port + '/' + subUrl;
  request.get(
    { url: url }
  ).on('error', function (error) {
    console.log('PostmanClient: error occured in get');
  });
}

PostmanClient.prototype.post = function (subUrl, callback) {
  var url = 'http://' + self.ip + ':' + self.port + '/' + subUrl;
  request.post(
    { url: url },
    function (error, response, body) {
      if (error) {
        console.log('PostmanClient: error occured in post');
      }
      else if(callback){
        callback(response);
      }
    });
}

module.exports = PostmanClient;