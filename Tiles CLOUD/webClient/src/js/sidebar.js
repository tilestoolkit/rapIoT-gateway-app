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
var sidebarToggle={
    layout:null,
    menu:null,
    menuLink:null,

    toggleClass:function(element,className){

        console.log(":::CLASSNAME:::",className,"element",element);
        var classes = element.className.split(/\s+/);
        var length = classes.length;

        for (var i = 0; i < length; ++i) {
            if (classes[i] === className) {
                classes.splice(i, 1);
                break;
            }
        }

        if (length === classes.length)
            classes.push(className);

        element.className=classes.join(' ');
    },

    init:function(){
        this.layout = document.getElementById('layout');
        this.menu = document.getElementById('menu');
        this.menuLink = document.getElementById('menuLink');


        this.menuLink.onclick = function (e) {
            var active = 'active';

            e.preventDefault();
            sidebarToggle.toggleClass(sidebarToggle.layout, active);
            sidebarToggle.toggleClass(sidebarToggle.menu, active);
            sidebarToggle.toggleClass(sidebarToggle.menuLink, active);
        };
    }
};

