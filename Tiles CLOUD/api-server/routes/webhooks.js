var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Webhook = mongoose.model('Webhook');

/**
 * List all webhooks
 */
router.get('/', function(req, res, next) {
	Webhook.find({}).exec(function(err, docs){
    if (err) return next(err);
    res.json(docs);
	});
});

/**
 * List webhooks registered with this user
 */
router.get('/:user', function(req, res, next) {
  Webhook.find({user: req.params.user}).exec(function(err, docs){
    if (err) return next(err);
    res.json(docs);
  });
});

/**
 * List webhooks registered with this user and Tile
 */
router.get('/:user/:tile', function(req, res, next) {
	Webhook.find({user: req.params.user, tile: req.params.tile}).exec(function(err, docs){
    if (err) return next(err);
    res.json(docs);
	});
});

/**
 * Create (register) a webhook
 */
router.post('/:user/:tile', function(req, res, next) {
  var webhook = new Webhook({user: req.params.user, tile: req.params.tile, postUrl: req.body.postUrl});
  webhook.save(function(err, webhook){
    if (err) return next(err);
    res.json(webhook);
  });
});

/**
 * Get a webhook
 */
router.get('/:user/:tile/:id', function(req, res, next) {
  Webhook.findById(req.params.id, function(err, webhook){
    if (err) return next(err);
    res.json(webhook);
  });
});

/**
 * Update a webhook
 */
router.put('/:user/:tile/:id', function(req, res, next) {
  var postUrl = req.body.postUrl;
  if (postUrl != null) {
    Webhook.findByIdAndUpdate(req.params.id, {postUrl: postUrl}, {new: true}, function(err, webhook){
      if (err) return next(err);
      if (webhook === null) res.status(404).end();
      else res.json(webhook);
    });
  } else {
    res.status(400).end();
  }
});

/**
 * Delete (unregister) a webhook
 */
router.delete('/:user/:tile/:id', function(req, res, next) {
	Webhook.findByIdAndRemove(req.params.id, function(err){
		if (err) return next(err);
    res.status(204).end();
	});
});

module.exports = router;