/**
 * Created by Jonas on 11.10.2015.
 */

var mosca = require('mosca');

var version="0.1.0";


var MQQTServer = (function () {
    var instance;

    function init() {
        var serverInstance = null;
     //   var clients= c.getInstance();

        var port=null;

        //listener functions
        function connect(client){
            instance.onConnect(client);
        }

        function publish(packet,client){
            instance.onPublish(packet,client);
        }

        function subscribe(topic,client){
            instance.onSubscribe(topic,client);
        }

        function unsubscribe(topic,client){
            instance.onUnsubscribe(topic,client);
        }

        function endstream(client){
            instance.onDisconnecting(client);
        }

        function disconnect(client){
            instance.onDisconnect(client);
        }

        function initListeners()
        {
            if(serverInstance===null)
                throw new Error("Server instance not initialized");

            serverInstance.on('clientConnected',connect);
            serverInstance.on('published',publish);
            serverInstance.on('subscribed',subscribe);
            serverInstance.on('unsubscribed',unsubscribe);
            serverInstance.on('clientDisconnecting',endstream);
            serverInstance.on('clientDisconnected',disconnect);
        }

        function setup()
        {
            console.log("MQTT (v"+version+") started running on port "+instance.port);
           /* serverInstance.authenticate=authenticate;
            serverInstance.authorizePublish=authorizePublish;
            serverInstance.authorizeSubscribe=authorizeSubscribe;*/
        }

        function generateSettings()
        {
           // console.log(instance.port,port);
            return {port:instance.port};
        }

        return {
            onConnect:function(client){},
            onPublish:function(packet,client){},
            onSubscribe:function(topic,client){},
            onUnsubscribe:function(topic,client){},
            onDisconnecting:function(client){},
            onDisconnect:function(client){},

            start:function(){
                serverInstance=new mosca.Server(generateSettings());

                serverInstance.on('ready',setup);
                initListeners();
            },
            setPort:function(port){
                this.port=port;
                console.log("this port",this.port);
            },
            publish:function(message,func){
                serverInstance.publish(message,func);
            }

        };
    }

    return {
        getInstance: function () {
            if (!instance)
                instance = init();
            return instance;
        }
    };
})();

module.exports=MQQTServer;