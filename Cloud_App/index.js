/**
 * Created by Jonas on 10.10.2015.
 *  _____ _____ __    _____ _____
 * |_   _|     |  |  |   __|   __|
 *   | | |-   -|  |__|   __|__   |
 *   |_| |_____|_____|_____|_____|
 */

var server=require('./model/mqServer.js');

var s=server.getInstance();

s.onConnect=function(client){
    console.log("connected",client.id);
};

/*
s.test=function(vari){
    console.log("vari override");
};*/

s.start();


/** Configurations**/
/*var mosca = require('mosca');

//{
var settings = {
    port: 1883
};

//here we start mosca
var server = new mosca.Server(settings);
server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running')
}

// fired whena  client is connected
server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
    console.log('Published MIO: ', packet.payload,packet.topic);
});

// fired when a client subscribes to a topic
server.on('subscribed', function(topic, client) {
    console.log('subscribed : ', topic);
});

// fired when a client subscribes to a topic
server.on('unsubscribed', function(topic, client) {
    console.log('unsubscribed : ', topic);
});

// fired when a client is disconnecting
server.on('clientDisconnecting', function(client) {
    console.log('clientDisconnecting : ', client.id);
});

// fired when a client is disconnected
server.on('clientDisconnected', function(client) {
    console.log('clientDisconnected : ', client.id);
});*/