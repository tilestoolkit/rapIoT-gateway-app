import paho.mqtt.client as mqtt

#TileClient connecting to TileServer
class TileClient:
    def __init__(self,username,host,port=1883,keepAlive=60):
        self.username=username
        self.host=host
        self.port=port
        self.keepAlive=keepAlive

        self.client=mqtt.Client()

        self.listeners={}
        self.patternListeners={}

    #Add new listener to topic
    #adds username as default in front of listener 
    def addListener(self,topic,listener):
        if(self.listeners[topic]):
            return False

        listener.setClient(self)
        self.listeners[self.username+topic]=listener

        return True
    #Add  new listener to topic pattern
    #see mqtt details for allowed patterns (+/#)
    #adds username as default infront of pattern
    def addPatternListener(self,pattern,listener):
        if(self.patternListeners.get(pattern)):
            return False

        listener.setClient(self)
        self.patternListeners[self.username+pattern]=listener

        return True

    def authClient(self,password):
        self.client.username_pw_set(self.username,pw)

    #Connect client to server and subscribe to topic based on provided username
    def connect(self):
        self.client.on_connect=self.on_connect
        self.client.on_message=self.on_message
        self.client.on_disconnect=self.on_disconnect
        self.client.on_subscribe=self.on_subscribe
        self.client.on_unsubscribe=self.on_unsubscribe

        self.client.connect(self.host,self.port,self.keepAlive)

    #Disconenct client to server
    def disconnect(self):
        self.client.disconnect()

    #Subscribe to new topic
    def subscribe(self,topic):
        self.client.subscribe(topic)

    def unsubscribe(self,topic):
        self.client.unsubscribe(topic)

    #Publish to new topic
    def publish(self,topic,data,qos=0,retain=False):
        self.client.publish(topic,data,qos,retain)

    #Run client infinite amount of time
    def run(self):
        self.connect()
        self.client.loop_forever()


    #######################
    #    ON LISTENERS
    #######################

    #On client connected
    def on_connect(self,client,userdata,flags,rc):
        print("CLIENT connected")
        self.subscribe(self.username+"/#") #subscribe to username topic

    #On new message received
    def on_message(self,client,userdata,msg):
        #Check if topic exists in listeners
        listener=self.listeners.get(msg.topic)
        if(listener):
            listener.listen(msg.topic,msg.playload)
        else:#or look through the pattern listeners
            for i in self.patternListeners:
                if(mqtt.topic_matches_sub(i,msg.topic)):
                    self.patternListeners[i].listen(msg.topic,msg.payload)
                    break

    #On client disconnected
    def on_disconnect(self,client,userdata,rc):
        if(rc!=0):
            print("Couldn't disconnect")

    def on_subscribe(self,client,userdata,mid,granted_qos):
        print("Subscribed")

    def on_unsubscribe(self,client,userdata,mid):
        print("Unsubscribed")
