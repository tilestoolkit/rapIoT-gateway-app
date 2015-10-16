/**
 * Tiles project
 * Project at NTNU
 *
 * Project: webClient
 * Author: Jonas
 * 14.10.2015
 * First created in in v0.1.0
 */
var LedOn = function (domId) {
    this.status = false;
    this.domElement = document.getElementById(domId);

    this.pubSend="TileSend";
};

LedOn.prototype.changeDomStatus = function () {
    this.domElement.className = ((this.status) ? "active" : "");
};

LedOn.prototype.changeStatus = function (id,client) {

    this.status=(!this.status);

    var sendStatus = (this.status) ? "on" : "off";

    var msg = {
        id: id,
        activation: sendStatus
    };


    this.changeDomStatus();

    client.publish(this.pubSend,msg);

};