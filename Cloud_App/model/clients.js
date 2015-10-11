/**
 * Created by Jonas on 05.10.2015.
 * singleton: http://blog.mgechev.com/2014/04/16/singleton-in-javascript/
 *
 * Connected clients "class" holding connected clients in a variable.
 * Methods for subscribing and publishing, and keeping the connection alive
 */
var ConClients=(function(){
    var instance;

    function init() {
        //add private methods and variables here

        //function privateMethod(){}
        //var privateVariable="test";

        var clients={};

        return{
            //public methods and variables
            //publicMethod:function(){},publicProperty:""
            addClient:function(id,client)
            {
                client.id=id;
                client.subscriptions=[];
                clients[id]=client;

                //client.connack({returnCode:0});
            },
            removeClient:function(id)
            {
                delete clients[id];
            },
            publish:function(message,payload)
            {
                for(var i in clients)
                {
                    console.log("client i:"+i);
                    console.log("client data:"+clients[i]);
                    for(var j=0;j<clients[i].subscriptions.length;++i)
                    {
                        if(clients[i].subscriptions[j].test(message))
                        {
                            clients[i].publish({topic:message,payload:payload});
                            break;
                        }
                    }
                }
            },
            subscribe:function(subscriptions,messageId,clientId)
            {
                var granted=[];

                for(var i=0;i<subscriptions.length;++i)
                {
                    var qos=subscriptions[i].qos;
                    var topic=subscriptions[i].topic;
                    reg=new RegExp(topic.replace('+','[^\/]+').replace('#','.+')+'$');

                    granted.push(qos);
                    clients[clientId].subscriptions.push(reg);
                }

                clients[clientId].suback({messageId:messageId,granted:granted});
            },
            endStream:function(clientId)
            {
                console.log(clientId);
                if(clientId!==undefined)
                    clients[clientId].stream.end();
            },
            respondPing:function(clientId)
            {
                clients[clientId].pingresp();
            }

        };
    }

    return {
        getInstance:function(){
            if(!instance)
                instance=init();
            return instance;
        }
    };

})();

module.exports=ConClients;