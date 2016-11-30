'use strict';

function EventReader() {
}

EventReader.prototype.readEvent = function (event, client) {
    var tile = this.getTile(event.name, client);
    tile.isSingleTap = (event.properties[0] === 'tap' && event.properties[1].startsWith('single'));
    tile.isDoubleTap = (event.properties[0] === 'tap' && event.properties[1].startsWith('double'));
    tile.isTilt = (event.properties[0].startsWith('tilt'));

    return tile;
}

EventReader.prototype.getTile = function (name, client) {
    var id = 0;
    if (client.tiles[name]) {
        id = client.tiles[name];
    }
    var tile = {
        name: name,
        id: id
    };

    tile.ledOn = function (color) {
        client.send(id, 'led', 'on', color);
    }
    tile.ledBlink = function (color) {
        client.send(id, 'led', 'blink', color);
    }
    tile.ledOff = function () {
        client.send(id, 'led', 'off');
    }
    tile.hapticBurst = function () {
        client.send(id, 'haptic', 'burst');
    }
    tile.hapticLong = function () {
        client.send(id, 'haptic', 'long');
    }

    return tile;
}

EventReader.prototype.getPrinter = function (name, client) {
    var id = 0;
    if (client.tiles[name]) {
        id = client.tiles[name];
    }
    var printer = {
        name: name,
        id: id
    };

    printer.print = function (str) {
        var start = 0, end = 11;
        var print = true;
        while (print) {
            var message = str.substring(start, end);
            console.log(message);
            client.send(id, "printer", message);
            start += 11;
            end += 11;
            print = (lastTweet.length > start);
        }
    }

    return printer;
}

module.exports = EventReader;