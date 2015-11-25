import tileclient
from TileActiveListener import TileActiveListener


#API testing
api=tileclient.TileApi("testuser","localhost",3000)
print(api.getTiles())
print(api.getUsers())
print(api.publish("hello","world1"))
print(api.lastOnTopic("hello"))


#Active listener
c=tileclient.TileClient("testuser","localhost",3001)
c.addPatternListener("/+/active",TileActiveListener())
c.run()
