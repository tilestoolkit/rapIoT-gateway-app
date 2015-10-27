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
    console.log("new tile..");
    this.id = id;
    this.name = TileNames[size++];

    var client = TileClient.getInstance();
    console.log(this);
    client.subscribe(this.id);

    client.addModule(this.id, this.onAction);
};

Tile.prototype.onAction = function (data) {
    Func.toggleClass(Variables.tileDevicePrefix + data.fromID, 'active');
    setTimeout(function () {
        Func.toggleClass(Variables.tileDevicePrefix + data.fromID, 'active');
    }, 100);
};




