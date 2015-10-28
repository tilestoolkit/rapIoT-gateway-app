/**
 * Created by Jonas on 26.10.2015.
 */
"use strict";
var Func = {
    triggerEvent: function (topic, msg) {
        $.event.trigger({
            type: topic,
            message: msg,
            time: new Date()
        });
    },
    parseMsg: function (str) {
        try {
            var json = JSON.parse(str);

            if (json.type === undefined || json.Event === undefined)
                return false;

            switch (json.type) {
                case 'touch_event':
                case 'motion_event':
                case '':
                    break;

                default:
                    return false;
            }

            switch (json.Event) {
                case 'tap':
                case 'doubletap':
                case 'forcetap':
                case 'swipeleft':
                case 'swiperight':
                case 'shaken':
                case 'tilted':
                case '':
                    break;

                default:
                    return false;
            }

            return json;

        }
        catch (e) {
            return false;
        }
    },
    generateMsg: function (Tile, type, activation, color, pattern, duration) {
        var object = {
            ID: Tile.id
        };

        if (type)
            object.Type = type;
        if (activation)
            object.Activation = activation;
        if (color)
            object.Color = color;
        if (pattern)
            object.Pattern = pattern;
        if (duration)
            object.Duration = duration;

        return JSON.stringify(object);
    },
    onDebugTile: function () {
        $(".tile-terminal").on("click", function (e) {
            Func.appendTemplateModal(JST['debugModal'](RegisterDevice.getInstance().getTile($(this).data('id'))));

        });
    },
    appendTemplateModal: function (html) {
        var element = $("#" + Variables.modalId);
        element.html(html);

        element.modal('show');
    },
    toggleClass: function (id, toggleClass) {
        this.toggleClassElement(document.getElementById(id),toggleClass);
    },
    toggleClassElement:function(el,toggleClass){
        el.classList.toggle(toggleClass);
    },
    /**
     * Stores tile to local storage in browser
     * @param tile Tile object
     */
    storeTile:function(tile){
        var tiles=store.get(Variables.storeTileKey);

        tiles[tile.id]=tile;
        store.set(Variables.storeTileKey,tiles);
    },
    /**
     * Removes stored tile from local storage
     * @param tile Tile object
     */
    removeStoreTile:function(tile){
        var tiles=store.get(Variables.storeTileKey);

        if(tiles[tile.id]!==undefined)
        {
            tiles[tile.id]={};
            delete tiles[tile.id];
        }
    }
};