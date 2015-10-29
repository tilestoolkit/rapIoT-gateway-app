/**
 * Created by Jonas on 29.10.2015.
 */
var express = require('express');
var User = require('../models/User');

var Token=require('./verifyToken');

var routes = express.Router();

routes.post('/authenticate', function (req, res) {
    User.findOne({username: req.body.username}, function (error, user) {
        if (error)
            throw error;

        if (!user)
            res.json({error: true, message: 'Authentication failed. User not found.'});
        else {
            user.comparePassword(req.body.password, function (error, isMatch) {
                if (error)
                    throw error;
                if (isMatch) {//if password matches..
                    //..start generating token
                    var token=Token.create(user,req.app.get('secret'))

                    res.json({
                        success: true,
                        message: 'Token generated',
                        token: token
                    });
                }
                else
                    res.json({error: true, message: 'Authentication failed. Wrong password provided.'});
            });
        }
    });
});

//verify token for rest of routes defined
routes.use(Token.verify);

routes.get('/', function (req, res) {
    res.json({message: 'TILES API on /api' + req.app.get('secret')});
});


routes.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

module.exports = routes;