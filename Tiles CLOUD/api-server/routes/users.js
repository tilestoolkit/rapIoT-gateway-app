var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find(function(err, users){
    if(err){ return next(err); }
    res.json(users);
  });
});

router.post('/', function(req, res, next) {
  var user = new User(req.body);

  user.save(function(err, user){
    if(err){ return next(err); }
    res.json(user);
  });
});

router.param('user', function(req, res, next, id) {
  var query = User.findById(id).populate('tiles');

  query.exec(function (err, user){
    if (err) { return next(err); }
    if (!user) { return next(new Error('Can\'t find user.')); }

    req.user = user;
    return next();
  });
});

router.get('/:user', function(req, res) {
  res.json(req.user);
});

router.post('/:user/tiles', function(req, res) {
  var tileDeviceId = req.body.deviceId;
  req.user.addTile(tileDeviceId);
  res.json(req.user.tiles);
});

router.get('/:user/tiles', function(req, res, next) {
  res.json(req.user.tiles);
});

module.exports = router;