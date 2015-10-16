/**
 * Tiles project
 * Project at NTNU
 *
 * Project: Cloud_App
 * Author: Jonas
 * 14.10.2015
 * First created in in v0.1.0
 */
"use strict";

var server = require('./mqServer.js');//require mqtt server

var TileCloud = function (port, wsPort) {
    this.tCloud = server.getInstance();
    this.tCloud.setPort(port, wsPort);

    this.debug = true;
};

/**
 * Output string when debug===true
 * Should be used instead of console.log for easy debugging
 * @param str string to output
 */
TileCloud.prototype.debugOutput = function (str) {
    if (this.debug)
        console.log(str);
};

/**
 * generates a mqtt message to publish to clients
 * @param topic string which subscribers should receive the message
 * @param str string message to send
 * @returns {{topic: string, payload: (string), qos: number, retain: boolean}}
 */
TileCloud.prototype.generateMsg = function (topic, str) {
    var sendStr = (str instanceof Object) ? JSON.stringify(str) : str.toString();
    return {
        topic: topic,
        payload: sendStr,
        qos: 0,
        retain: false
    };
};

/**
 * Start TileCloud service,
 * by defining listeners
 */
TileCloud.prototype.start = function () {

    var self = this;
    this.tCloud.onConnect = function (client) {
        self.debugOutput("Client connected: " + client.id);
    };

    this.tCloud.onPublish = function (packet, client) {
        //check if publish is in fact from a connected client
        // and not a $SER packet
        if (client !== undefined && client !== null) {
            if (packet.topic === "Tiles") {//forward msg to webclient
                self.tCloud.publish(self.generateMsg("TilesReceive", packet.payload), self.debugOutput("published msg to topic TilesReceive: " + packet.payload.toString()));
            }
            else if (packet.topic === "TileSend") {//forward msg from webclient to tiles subscribers
                self.tCloud.publish(self.generateMsg("Tiles", packet.payload), self.debugOutput("published msg to topic Tiles: " + packet.payload.toString()));
            }
        }
    };

    this.tCloud.start();//start mqtt server
};

module.exports = TileCloud;//export class to module, to make it available for nodejs


