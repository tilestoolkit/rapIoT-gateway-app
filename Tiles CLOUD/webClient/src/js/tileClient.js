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
var TileClient = (function () {
    var instance;

    function init() {

        var url = null;
        var client = null;
        var modules = {};
        var connected = false;

        function listen() {
            client.on(Variables.mqttMsg, function (topic, payload) {
                console.log("topic-payload", topic, payload);
                var json = Func.parseMsg(payload);
                /*   if (json !== false) {
                 var func = TileClient.getInstance().getModule(topic);
                 if (func !== false)
                 func(json);//pass json to function
                 }
                 else
                 Func.triggerEvent("tile-error","wrong format on data received");
                 */
                if (json === false)
                    json = payload.toString();

                var func = TileClient.getInstance().getModule(topic);
                if (func !== false)
                    func(json, topic);//pass json to function
                else
                    Func.triggerEvent(Variables.triggerError, "topic not registered: " + topic);
            });
        }

        return {
            /**
             * Connects to server
             * @param url string url and port to connect to. format: hostname/ip:port
             * @returns {boolean} whether connected to server successfully
             */
            connect: function (url) {
                this.url = url;
                client = mqtt.connect(this.url);
                var self = instance;

                client.on(Variables.mqttConnect, function () {
                    self.connected = true;
                    Func.triggerEvent(Variables.onConnect, "Tile web-client connected");
                });

                listen();
            },
            isConnected: function () {
                return connected;
            },
            /**
             * Subscribe to a given topic
             * @param topic
             */
            subscribe: function (topic) {
                client.subscribe(topic);
            },
            /**
             * Publish to a topic. If msg is an object, input is stringified.
             * @param topic
             * @param msg string|object message to publish
             */
            publish: function (topic, msg) {
                var sendStr = (msg instanceof Object) ? JSON.stringify(msg) : msg.toString();

                client.publish(topic, sendStr);
            },
            addModule: function (topic, func) {
                if (modules[topic] === undefined)
                    modules[topic] = func;
            },
            hasModule: function (topic) {
                if (modules[topic] !== undefined)
                    return true;
                return false;
            },
            getModule: function (topic) {
                if (this.hasModule(topic))
                    return modules[topic];
                return false;
            }

        };
    }

    return {
        /**
         * Get current instance of TileClient making sure only one instance is created
         * @returns {*}
         */
        getInstance: function () {
            if (!instance)//if instance doesn't exists..
                instance = init();//..initialize it
            return instance;
        }
    };
})();

//TODO: create class TileModule, which needs to be sent to function:
// TODO: TileModule should be inherited from all modules needed to run in browser
