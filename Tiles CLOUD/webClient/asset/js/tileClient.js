/**
 * Tiles project
 * Project at NTNU
 *
 * Project: webClient
 * Author: Jonas
 * 14.10.2015
 * First created in in v0.1.0
 */

/**
 * @param url string url and port to connect to. format: hostname/ip:port
 * @constructor
 */
var TileClient = function (url) {
    this.url = url;
    this.client = null;//client handling mqtt connecting
    this.modules = [];
    this.connected=false;
};

/**
 * Connects to server
 * @returns {boolean} whether connected to server successfully
 */
TileClient.prototype.connect = function (dom) {
    this.client = mqtt.connect(this.url);

    var self=this;
    this.client.on("connect",function(){
       self.connected=true;
        console.log("DOM",dom,$(dom));
      //  $(dom).trigger("connected");
        $.event.trigger({
            type:    "connected",
            message: "Tile Client connected",
            time:    new Date()
        });
    });
};

TileClient.prototype.isConnected = function () {
    return this.connected;
};

/**
 * Subscribe to a given topic
 * @param topic
 */
TileClient.prototype.subscribe = function (topic) {
    this.client.subscribe(topic);
};

/**
 * Publish to a topic. If msg is an object, input is stringified.
 * @param topic
 * @param msg string|object message to publish
 */
TileClient.prototype.publish = function (topic, msg) {
    var sendStr = (msg instanceof Object) ? JSON.stringify(msg) : msg.toString();

    this.client.publish(topic, sendStr);
};

TileClient.prototype.listen = function () {

    var self = this;
    this.client.on("message", function (topic, payload) {
        try {//try parsing payload to json
            var json = JSON.parse(payload);

            if (self.modules[topic] !== undefined)
                self.modules[topic](json);//pass json to function
        }
        catch (e) {//received data not on json format
            return false;
        }
    });
};


//TODO: create class TileModule, which needs to be sent to function:
// TODO: TileModule should be inherited from all modules needed to run in browser
TileClient.prototype.addModule = function (topic, func) {
    if (this.modules[topic] === undefined)
        this.modules[topic] = func;
};
