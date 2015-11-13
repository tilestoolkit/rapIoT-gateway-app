var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Tile = mongoose.model('Tile')
var User = mongoose.model('User')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

  var fieldsToUpdate = {}; // Only update fields that are defined and not null
  if (userId != null) fieldsToUpdate.user = userId;
  if (active != null) fieldsToUpdate.active = active;
  if (state != null) fieldsToUpdate.state = state;

  Tile.findByIdAndUpdate(tileId, fieldsToUpdate, {upsert: true, new: true}, function(err, tile){
    if (err) return next(err);
    if (userId) {
      User.findById(userId, function(err, user){
        user.addTile(tile, null);
      });
    }
    return res.json(tile);
  });
});

module.exports = router;
