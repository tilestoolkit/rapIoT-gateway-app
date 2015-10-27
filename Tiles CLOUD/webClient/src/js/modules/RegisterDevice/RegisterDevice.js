/**
 * Tiles project
 * Project at NTNU
 *
 * Project: webClient
 * Author: Jonas
 * 14.10.2015
 * First created in in v0.1.0
 */
"use strict";
var RegisterDevice = (function () {

    var instance;

    function init() {
        var tiles = {};

        var client = TileClient.getInstance();
        client.subscribe(Variables.tileActivate);
        client.subscribe(Variables.tileDeactivate);

        return {
            connect: function (json) {
                console.log('New tile connected');
                /*if (tiles[json.fromID] === undefined) {
                    tiles[json.fromID] = new Tile(json.fromID);
                }
                else
                    console.log("tile already registered");*/
                if (tiles[json] === undefined) {
                    tiles[json] = new Tile(json);
                    Func.triggerEvent(Variables.onTileChange, "new tile connected");
                }
                else
                    console.log("tile already registered");



            },
            disconnect: function (json) {
                console.log('Tile disconnect');
               /* if (tiles[json.fromID] !== undefined) {
                    tiles[json.fromID] = {};
                    delete tiles[json.fromID];
                    Func.triggerEvent(Variables.onTileChange, "tile disconnected");
                }*/
                if(tiles[json]!==undefined){
                    tiles[json] = {};
                    delete tiles[json];
                    Func.triggerEvent(Variables.onTileChange, "tile disconnected");
                }

            },
            getTiles: function () {
                var tempTiles = {
                    tiles: []
                };

                for (var key in tiles)
                    tempTiles.tiles.push({
                        name: tiles[key].name,
                        id: tiles[key].id,
                        online: true,
                        inUse: false
                    });

                return tempTiles;
            },
            getTile: function (id) {
                if (tiles[id] !== undefined)
                    return tiles[id];
            }
        };
    }

    return {
        /**
         * Get current instance of TileClient making sure only one instance is created
         * @returns {*}
         */
        getInstance: function () {
            if (!instance)//if instance doesn't exists..
                instance = init();//..initialize it
            return instance;
        }
    };
})();