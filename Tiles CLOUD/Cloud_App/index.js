/**
 * Created by Jonas on 10.10.2015.
 *  _____ _____ __    _____ _____
 * |_   _|     |  |  |   __|   __|
 *   | | |-   -|  |__|   __|__   |
 *   |_| |_____|_____|_____|_____|
 */
"use strict";
var Server = require('./model/TileServer.js');

var tile = new Server(1883, 3000);
tile.start();


/**
 * ::::Format for sending msg::::
 * JSobject need to be stringified before it can be sent over mqtt

 var message = {
    topic: 'topicHere',
    payload: JSON.stringify(object), // or a Buffer
    qos: 0, // 0, 1, or 2
    retain: false // or true
};

 *
 */
