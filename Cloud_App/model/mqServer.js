/**
 * Tiles project
 * Project at NTNU
 *
 * Project: Cloud_App
 * Author: Jonas
 * 11.10.2015
 * First created in v0.1.0
 */
"use strict";
var mosca = require('mosca');

var version = "0.1.0";

/**
 *
 * @type {{getInstance}}
 */
var MQTTServer = (function () {
    var instance;

    function init() {
        var serverInstance = null;//instance of mqtt server
        var port = null;//port to listen for mqtt connections
        var wsPort = null;//port to listen for ws connections

        //listener functions
        function connect(client) {
            instance.onConnect(client);
        }

        function publish(packet, client) {
            instance.onPublish(packet, client);
        }

        function subscribe(topic, client) {
            instance.onSubscribe(topic, client);
        }

        function unsubscribe(topic, client) {
            instance.onUnsubscribe(topic, client);
        }

        function endstream(client) {
            instance.onDisconnecting(client);
        }

        function disconnect(client) {
            instance.onDisconnect(client);
        }

        //end listener functions

        function initListeners() {
            if (serverInstance === null)
                throw new Error("Server instance not initialized");

            serverInstance.on('clientConnected', connect);
            serverInstance.on('published', publish);
            serverInstance.on('subscribed', subscribe);
            serverInstance.on('unsubscribed', unsubscribe);
            serverInstance.on('clientDisconnecting', endstream);
            serverInstance.on('clientDisconnected', disconnect);
        }

        function setup() {
            console.log("Tiles (v" + version + ") started running.\n"+
                        "\tmqtt port: "+instance.port+"\n"+
                        "\tws port: "+instance.wsPort);

        }

        /**
         * settings for mosca/mqtt server running
         * @returns {{port: number, http: ({port, bundle, static}|*)}}
         */
        function generateSettings() {
            return {
                port: instance.port,
                http: generateWebsocketSettings()
            };
        }

        /**
         * settings for websocket listener. needed to accept websocket over mqtt
         * @returns {{port: number, bundle: boolean, static: string}}
         */
        function generateWebsocketSettings() {
            return {
                port: instance.wsPort,
                bundle: true,
                static: './'
            };
        }

        return {
            //listener functions, to be overwritten to handle events when triggered
            onConnect: function (client) {
            },
            onPublish: function (packet, client) {
            },
            onSubscribe: function (topic, client) {
            },
            onUnsubscribe: function (topic, client) {
            },
            onDisconnecting: function (client) {
            },
            onDisconnect: function (client) {
            },

            /**
             * Start the mqtt server, and start listening for clients
             */
            start: function () {
                serverInstance = new mosca.Server(generateSettings());

                serverInstance.on('ready', setup);
                initListeners();
            },
            /**
             * Set port to listen on
             * @param port int
             * @param wsPort int
             */
            setPort: function (port, wsPort) {
                this.port = port;
                this.wsPort = wsPort;
            },
            /**
             * Publish to connected clients. message should be in json format on format
             * according to documentation. Func is function to run on successful publish. Can be null
             * @param message json data of message to send
             * @param func function to run after successful publish
             */
            publish: function (message, func) {
                serverInstance.publish(message, func);
            }

        };
    }

    return {
        /**
         * Get current instance of MQTTserver making sure only one instance is created
         * @returns {*}
         */
        getInstance: function () {
            if (!instance)//if instance doesn't exists..
                instance = init();//..initialize it
            return instance;
        }
    };
})();

module.exports = MQTTServer;