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
var TileClient = (function () {
    var instance;

    function init() {

        var url = null;
        var client = null;
        var modules = {};
        var connected = false;


        function listen() {

            var self=instance;

            client.on("message", function (topic, payload) {
                console.log("SELF",self);
                var json = Func.parseMsg(payload);
                console.log("JSON", json);
                if (json !== false) {
                    var func=TileClient.getInstance().getModule(topic);
                    console.log("func",func);
                    if (func!==false)
                        func(json);//pass json to function
                }

            });
        }


        return {
            /**
             * Connects to server
             * @returns {boolean} whether connected to server successfully
             */
            connect: function (url, dom) {
                this.url = url;
                client = mqtt.connect(this.url);
                var self = instance;
                console.log(self, instance);
                client.on("connect", function () {
                    self.connected = true;
                    Func.triggerEvent("connected", "Tile web-client connected");
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
            hasModule:function(topic){
                if(modules[topic]!==undefined)
                    return true;
                return false;
            },
            getModule:function(topic){
                if(this.hasModule(topic))
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
