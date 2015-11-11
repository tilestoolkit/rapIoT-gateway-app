var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
  tiles: [String]
});

UserSchema.methods.addTile = function(tileDeviceId, cb) {
	this.tiles.addToSet(tileDeviceId);
	this.save(cb);
}

mongoose.model('User', UserSchema);