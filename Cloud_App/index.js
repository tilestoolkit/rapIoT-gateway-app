/**
 * Created by Jonas on 10.10.2015.
 *  _____ _____ __    _____ _____
 * |_   _|     |  |  |   __|   __|
 *   | | |-   -|  |__|   __|__   |
 *   |_| |_____|_____|_____|_____|
 */

var server = require('./model/mqServer.js');
var tp=require('./model/tileParse.js');

var s = server.getInstance();

s.setPort(1883);

s.onConnect = function (client) {
    console.log("connected", client.id);
};

s.onPublish = function (packet, client) {
    if(client!==undefined&&client!==null)
    {
        console.log("\tclient",client.id);
        var data=new tp(packet.payload.toString());

        if(data.getId()==='12:34:56:78' && data.getEvent()==='tap')
        {
            s.publish(message, function () {
                console.log("published");
            });
        }
    }
};

s.onSubscribe = function (topic, client) {
    s.publish(message, function () {
        console.log("published");
    });
};


s.start();


var all={
    id:"12:34:56:78",
    type:"led",
    activation:"on",
    color:"white",
    pattern:"blink",
    duration:100
};

var message = {
    topic: 'action',
    payload: all, // or a Buffer
    qos: 0, // 0, 1, or 2
    retain: false // or true
};


