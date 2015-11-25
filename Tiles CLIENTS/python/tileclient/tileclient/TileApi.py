import httplib
import json
import socket

class TileApi:

    class REST:
        def __init__(self,username,host,port):
            self.host=host
            self.port=port
            self.username=username
            self.con=0
            self.headers={"Content-Type":"application/json"}

            self.auth=True


        def connect(self):
            self.con=httplib.HTTPConnection(self.host,self.port)

        def disconnect(self):
            self.con.close()

        #general http request
        def request(self,method,url,body):

            if(self.auth):
                url+="?username="+self.username

            try:
                self.connect()
                self.con.request(method,url,body,self.headers)

                readData=self.con.getresponse().read()
                try:
                    data=json.loads(readData)
                except ValueError:
                    data=readData

                self.disconnect()
                return data
            except socket.error as e:
                print("Couldn't connect to route: "+url)
            return 0



        ##HTTP METHODS
        def get(self,url,data=""):
            return self.request("GET",url,data)
        def post(self,url,data):
            return self.request("POST",url,data)
        def delete(self,url,data=""):
            return self.request("DELETE",url,data)
        def put(self,url,data):
            return self.request("PUT",url,data)




    def __init__(self,username,host,port):
        self.host=host
        self.port=port
        self.client=self.REST(username,host,port)

    ##ROUTES##

        ##TILE ROUTES
    def getTiles(self):
        return self.client.get("/tile")

    def getTile(self,id):
        return self.client.get("/tile/"+id)

    def createTile(self,data):
        tileData={}
        if(data.id and data.name):
            tileData["id"]=data.id
            tileData["name"]=data.name

            return self.client.post("/tile",tileData)
        return False


        ##USER ROUTES
    def getUsers(self):
        return self.client.get("/users")

        ##PUBLISH ROUTES
    def publish(self,topic,payload):
        self.client.auth=False
        data=self.client.put("/mqtt/"+topic,payload)
        self.client.auth=True

        return data

    def lastOnTopic(self,topic):
        return self.client.get("/mqtt/"+topic)






