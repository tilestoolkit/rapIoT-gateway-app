#WebClient
The WebClient is using MQTT.js client found [here](https://github.com/mqttjs/MQTT.js).
The javascript library is installed using `Browserify`. 
See documentation for generating client mqtt javascript file
[here](https://github.com/mqttjs/MQTT.js#browser).

#Dependencies
To install bower dependencies defined in `bower.js`, you need to have bower installed.
Install it globally using Nodejs by running `npm install bower -g`.

Install the dependencies by running `bower install` and `npm install`.


##Grunt
The project also needs to have [grunt](http://gruntjs.com/) installed for running the `Gruntfile.js`.
Install grunt by running `npm install -g grunt-cli`. Run grunt by using the `grunt` command run from the project directory.



##Installing
All compiled files will be put in the folder `dist`. To start compiling, run the `grunt` command within the terminal. 
The `dist` folder should now be created. To auto-compile the project when changes are made within the project files
run `grunt watch`.



#Source Code
All source code is located under the `src/` folder. 

##Views
Layout files, written in HandlebarsJs, is located in `src/views/`. Files within `layouts/` define the general
 structure of the html page to be generated. Page content files is located within the `pages/` folder.
 Grunt will compile and create a html file for each `.hbs` file located in this folder.
 
 Static partials of the site is located under `partials/`, which defines the look of the footer, header and the sidebar.
 
 Template html files are located within the `templates/` folder. These files are compiled to a common `template.js` file
 as defined in `Gruntfile.js`, and can be used by the website for rendering common objects/types.
  
##Javascript
The model/javascript files are located within the folder `src/js`. These files are minified on compilation.
The output `browserMqtt.js` file from Browserifying the MQTT should be put here!
 
##CSS
The CSS files are located within the `src/css` folder. Put any css files here to be included within the compilation to
`dist/` in the build process. All files within this folder is minifed before moved to the `dist/` folder in the
build process.
 
##SCSS
SCSS files are located within `src/scss/`. These files are compiled to `.css` files within the CSS folder. 
