/**
 * Tiles project
 * Project at NTNU
 *
 * Project: webClient
 * Author: Jonas
 * 14.10.2015
 * First created in in v0.1.0
 */
var RegisterDevice=function(){
    var client=TileClient.getInstance();
    client.subscribe('activate');
    client.subscribe('deactivate');

    this.tiles={};
};


RegisterDevice.prototype.connect=function(json){
    console.log("connected",json);
    console.log("tiles",this.tiles);

    if(this.tiles===undefined)
        this.tiles={};

    if(this.tiles[json.fromID]===undefined)
        this.tiles[json.fromID]=new Tile(json.fromID);
    else
        console.log("tile already registered");
};

RegisterDevice.prototype.disconnect=function(json){
    console.log("disconneted",json);

    if(this.tiles[json.fromID]!==undefined)
    {
        this.tiles[json.fromID]={};
        delete this.tiles[json.fromID];
    }
};