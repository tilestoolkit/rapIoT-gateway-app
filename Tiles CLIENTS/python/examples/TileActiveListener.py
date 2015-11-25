import tileclient

class TileActiveListener(tileclient.TileListener):
    def __init__(self):
        tileclient.TileListener.__init__(self,100)

    def listen(self,topic,data):
        print("ACTIVE LISTENER"+data)

        if(data=="true"):
            print("publishing..")
            self.publish("foo","bar")#publish to topic
