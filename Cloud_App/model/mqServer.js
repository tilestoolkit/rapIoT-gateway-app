/**
 * Created by Jonas on 11.10.2015.
 */

var mosca = require('mosca');
var c=require('./clients.js');

var version="0.1.0";

var settings = {
    port: 1883
};

var MQQTServer = (function () {
    var instance;

    function init() {
        var serverInstance = null;
        var clients= c.getInstance();

        //listener functions
        function connect(client){
            clients.addClient(client.id,client);
            instance.onConnect(client);
        }

        function publish(packet,client){
            console.log(packet);
           // clients.publish(client);
            instance.onPublish(client);
        }

        function subscribe(client){
            clients.subscribe(client);
            instance.onSubscribe(client);
        }

        function unsubscribe(client){
            //clients.unsubscribe(client);
            instance.onUnsubscribe(client);
        }

        function endstream(client){
            clients.endStream(client.id);
            instance.onDisconnecting(client);
        }

        function disconnect(client){
            clients.removeClient(client.id);
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
            console.log("MQTT (v"+version+") started running on port "+settings.port);
        }

        return {
            onConnect:function(client){},
            onPublish:function(client){},
            onSubscribe:function(client){},
            onUnsubscribe:function(client){},
            onDisconnecting:function(client){},
            onDisconnect:function(client){},

            start:function(){
                serverInstance=new mosca.Server(settings);

                serverInstance.on('ready',setup);
                initListeners();
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