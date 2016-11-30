var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  _id: String,
  tiles: [{ type: String, ref: 'Tile' }]
});

UserSchema.methods.addTile = function(tile, cb) {
	this.tiles.addToSet(tile);
	this.save(cb);
}

mongoose.model('User', UserSchema);