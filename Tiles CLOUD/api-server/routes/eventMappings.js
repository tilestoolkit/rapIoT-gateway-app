var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var EventMappings = mongoose.model('EventMappings');

/**
 * Get event mappings for specified user and Tile
 */
router.get('/:user/:tile', function(req, res, next) {
	EventMappings.findOne({user: req.params.user, tile: req.params.tile}).exec(function(err, doc){
    if (err) return next(err);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    if (doc == null) res.json({});
    else res.json(doc.eventMappings);
	});
});

/**
 * Create/replace event mappings for specified user and Tile
 */
router.post('/:user/:tile', function(req, res, next) {
  var newEventMappings = req.body.eventMappings;
  if (newEventMappings != null) {
    EventMappings.findOneAndUpdate({user: req.params.user, tile: req.params.tile}, { $set: { eventMappings: newEventMappings } }, {upsert: true, new: true}, function(err, eventMappings){
      if (err) return next(err);
      res.json(eventMappings);
    });
  } else {
    res.status(400).end();
  }
});

module.exports = router;