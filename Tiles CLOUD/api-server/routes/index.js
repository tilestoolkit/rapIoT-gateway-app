var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Tile = mongoose.model('Tile')
var User = mongoose.model('User')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { appVersion: req.app.get('appVersion'), buildDate: req.app.get('buildDate') });
});

router.get('/tiles', function(req, res, next) {
  Tile.find(function(err, tiles){
    if(err){ return next(err); }
    res.json(tiles);
  });
});

router.post('/tiles', function(req, res, next) {
  var tileId = req.body.tileId;  
  var userId = req.body.userId;
  var active = req.body.active;
  var state = req.body.state;
  var name = req.body.name;

  var fieldsToUpdate = {}; // Only update fields that are defined and not null
  if (userId != null) fieldsToUpdate.user = userId;
  if (active != null) fieldsToUpdate.active = active;
  if (state != null) fieldsToUpdate.state = state;
  if (name != null) fieldsToUpdate.name = name;

  Tile.findByIdAndUpdate(tileId, fieldsToUpdate, {upsert: true, new: true}, function(err, tile){
    if (err) return next(err);
    if (userId) {
      User.findByIdAndUpdate(userId, {}, {upsert: true, new: true}, function(err, user){
        user.addTile(tile, null);
      });
    }
    return res.json(tile);
  });
});

module.exports = router;
