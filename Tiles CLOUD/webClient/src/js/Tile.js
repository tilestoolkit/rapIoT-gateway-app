/**
 * Tiles project
 * Project at NTNU
 *
 * Project: webClient
 * Author: Jonas
 * 14.10.2015
 * First created in in v0.1.0
 */
"use strict";

var TileNames = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta"];
var size = 0;


var Tile = function (id) {
    this.id = id;
    this.name = TileNames[size++];
    this.online=true;
    this.inUse=false;

    var client = TileClient.getInstance();
    client.subscribe(this.id);
    client.addModule(this.id, this.onAction);
    Func.storeTile(this);
};

Tile.prototype.onAction = function (data,topic) {
    Func.toggleClass(Variables.tileDevicePrefix + topic, 'active');
    setTimeout(function () {
        Func.toggleClass(Variables.tileDevicePrefix + topic, 'active');
    }, 100);

   //Func.triggerEvent();
};



