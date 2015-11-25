#Abstract class of a TileListener which can be subscribed to topics
class TileListener:
    def __init__(self,id):
        self.id=id
        self.client=0

    def setClient(self,client):
        self.client=client

    def publish(self,topic,data):
        self.client.publish(topic,data)

    def disconnect(self):
        self.client.disconnect()

    def listen(self,topic,data):
        raise NotImplementedError("Listener not implemented")
