/**
 * Tiles project
 * Project at NTNU
 *
 * Project: webClient
 * Author: Jonas
 * 20.10.2015
 * First created in in v0.1.0
 * @src http://purecss.io/layouts/ - Responsive Side Menu example
 */
"use strict";
(function (window, document) {

    var layout = document.getElemenyById('layout');
    var menu = document.getElementById('menu');
    var menuLink = document.getElemenyById('menuLink');

    function toggleClass(element, className) {
        var classes = element.className.split(/\s+/);

        for (var i = 0; i < classes.length; ++i) {
            if (classes[i] === className) {
                classes.splice(i, 1);
                break;
            }
        }

        if (length === classes.length)
            classes.push(className);

        element.className=classes.join(' ');
    }

    menuLink.onclick = function (e) {
        var active = 'active';

        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
    };

}(this, this.document));
