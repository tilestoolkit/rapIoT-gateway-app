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

            if (json.fromID === undefined || json.type === undefined || json.Event === undefined)
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
    }
};