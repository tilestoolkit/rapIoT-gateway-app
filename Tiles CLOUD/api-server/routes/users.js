var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Tile = mongoose.model('Tile');

var spawn = require('child_process').spawn;
var processes = {};
var fs = require('fs');

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
    console.log("user",user);
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

router.get('/:user/tiles/:id', function(req, res, next) {
    for(var index in req.user.tiles)//loop through user Tiles, to see if any tiles are found matching current ID
    {
        if(req.user.tiles[index]['_id']===req.params.id)
        {
            res.json(req.user.tiles[index]);
            return;
        }
    }
    res.json({"error":true,"message":"No tile found"});
});

router.delete('/:user/tiles/:id', function(req, res, next) {
    User.update({_id:req.user._id},{$pull:{'tiles':req.params.id}},function(error,data){//remove tile from user
        if(data.nModified)
            res.json({"success":true,"message":"Tile removed"});
        else
            res.json({"error":true,"message":"Couldn't find Tile to remove"});
    });
});

router.get('/:user/tiles/name/:name', function(req, res, next) {
  for (var i = 0; i < req.user.tiles.length; i++) { 
    if (req.user.tiles[i]['name'] === req.params.name) {
      res.json(req.user.tiles[i]);
      return;
    }
  }
  return next(err);
});


router.post('/:user/application/:name', function (req, res, next) {
    var name = req.params.name;
    var code = req.body.code;
    
    console.log(code);
   // console.log("NAME",name);
   // console.log("CODE",code);
    
    var userid=req.user._id
    
    if(processes.userid==undefined)
      processes.userid={};

    if (processes.userid.name == null && code != null) {
      var path="C:\\gitProjects\\NTNU\\TileDSL\\example\\"+userid+name+".dsl";
      fs.writeFileSync(path, code);
      
        processes.userid.name = spawn('cmd.exe', ['/c', 'test.bat', userid+name]);

        processes.userid.name.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        processes.userid.name.stderr.on('data', (data) => {
            console.log(data.toString());
        });

        processes.userid.name.on('exit', (code) => {
            console.log(`Child exited with code ${code}`);
            processes.userid.name = null;
        });

        res.json({ "success": true, "message": "Started service successfully" });
    }
    else res.json({ "success": false, "message": "Application already running, or no code provided" });
});

router.delete('/:user/application/:name', function (req, res, next) {
    var name = req.params.name;
    if (processes.userid!=undefined && processes.userid.name != null) {
        spawn("taskkill", ["/pid", processes.userid.name.pid, '/f', '/t']);
        processes.userid.name = null;
        return res.json({ "success": true, "message": "Stopped service successfully" });
    }
    return res.json({ "success": false, "message": "Process not found. Please check application name" });
});


module.exports = router;
