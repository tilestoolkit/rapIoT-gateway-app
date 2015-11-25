import mp3play
from MusicListener import MusicListener
import tileclient

client=tileclient.TileClient("testuser","localhost",3001)
client.addPatternListener("/#",MusicListener(r'./foobar.mp3'))

client.run()