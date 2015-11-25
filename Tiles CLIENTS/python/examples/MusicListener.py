import mp3play
import tileclient

class MusicListener(tileclient.TileListener):
    def __init__(self,filename):
        tileclient.TileListener.__init__(self,101)
        self.clip=mp3play.load(filename)

    def listen(self,topic,data):
        if(self.clip.isplaying()):
            self.clip.pause()
        else:
            self.clip.unpause()
