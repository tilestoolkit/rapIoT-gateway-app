/**
 * Tiles project
 * Project at NTNU
 *
 * Project: Cloud_App
 * Author: Jonas
 * 13.10.2015
 * First created in v0.1.0
 */
"use strict";

/**
 * parses incoming string to a tileParse object, as defined by documentation format.
 * @see Google Drive specifications
 * @param str string
 * @constructor
 */
var TileParse = function (str) {

    try {
        this.data = JSON.parse(str);
    }
    catch (e) {
        throw new Error("Received string when expected a json formatted string.");
    }


    //check if all mandatory keys exists from parsed json
    if (this.data.hasOwnProperty('from_id') && this.data.hasOwnProperty('type') && this.data.hasOwnProperty('event')) {
        this.id = this.data.FromId;
        this.type = this.data.Type;
        this.event = this.data.Event;
    }
    else
        throw new Error("Illegal format for sent data");

};

/**
 * @returns string hex value - current id of tile
 */
TileParse.prototype.getId = function () {
    return this.id;
};

/**
 * @returns string type of event
 */
TileParse.prototype.getType = function () {
    return this.type;
};

/**
 * @returns string what event was triggered
 */
TileParse.prototype.getEvent = function () {
    return this.event;
};

module.exports = TileParse;//export class to module, to make it available for nodejs