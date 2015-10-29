/**
 * Created by Jonas on 29.10.2015.
 * API server accessible with web-tokens
 * @src: https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
 */

/**
 * Include dependencies
 */
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');//logging
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var app = express();//start express instance
var config = require('./config');//retrieve config

//Models
var User = require('./app/models/User');

//routes include:
var apiRoutes = require('./app/routes/api');


/**
 * Configuration
 */
var port = process.env.PORT || config.port;
mongoose.connect(config.database);//connect to database
app.set('secret',config.secret);


// get information from both POST and URL params
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));//log to console


/**
 * ROUTES
 */
app.get('/', function (req, res) {
    res.send('Hello TILES! API up and running! :)');
});

app.get('/setup', function (req, res) {
    var testUser = new User({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password'
    });

    testUser.save(function (error) {
        if (error)
            throw error;
        console.log('User saved');

        res.json({success: true, message: 'user generated'});
    });
});

app.use('/api', apiRoutes);


app.listen(port);
console.log("TILES API server started on port: " + port);
