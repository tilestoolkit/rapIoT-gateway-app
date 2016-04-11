var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var AppRecipe = mongoose.model('AppRecipe');

router.post('/:userId', function(req, res, next) {
    var userId = req.params.userId;
    var code = req.body.code;
    var name = req.body.name;

    if (typeof code !== 'undefined' && typeof name !== 'undefined') {
        AppRecipe.create({
            name: name,
            code: code,
            user: userId
        }, function(err, appRecipe) {
            if (err) return next(err);
            return res.json(appRecipe);
        })
    } else {
        return res.status(400).end();
    }
});

router.get('/:userId', function(req, res, next) {
    var userId = req.params.userId;

    AppRecipe.find({
        user: userId
    }, function(err, appRecipes) {
        if (err) return next(err);
        return res.json(appRecipes);
    });
});

router.put('/:userId/:appId', function(req, res, next) {
    var appId = req.params.appId;
    var code = req.body.code;

    if (typeof code !== 'undefined') {
        AppRecipe.findByIdAndUpdate(appId, {
            code: code
        }, {
            new: true
        }, function(err, appRecipe) {
            if (err) return next(err);
            return res.json(appRecipe);
        });
    } else {
        return res.status(400).end();
    }
});

router.get('/:userId/:appId', function(req, res, next) {
    var appId = req.params.appId;

    AppRecipe.findById(appId, function(err, appRecipe) {
        if (err) return next(err);
        return res.json(appRecipe);
    });
});

router.delete('/:userId/:appId', function(req, res, next) {
    var appId = req.params.appId;

    AppRecipe.findByIdAndRemove(appId, function(err) {
        if (err) return next(err);
        return res.status(204).end();
    });
});

router.put('/:userId/:appId/active', function(req, res, next) {
    var appId = req.params.appId;
    var active = req.body.active;

    if (typeof active !== 'undefined') {
        console.log('Active: ' + active + ' type: ' + (typeof active));
        AppRecipe.findById(appId, function(err, appRecipe) {
            if (err) return next(err);
            if (active) {
                appRecipe.activate(function(err, appRecipe) {
                    if (err) return next(err);
                    return res.json(appRecipe);
                });
            } else {
                appRecipe.deactivate(function(err, appRecipe) {
                    if (err) return next(err);
                    return res.json(appRecipe);
                });
            }
        });
    } else {
        return res.status(400).end();
    }
});

module.exports = router;