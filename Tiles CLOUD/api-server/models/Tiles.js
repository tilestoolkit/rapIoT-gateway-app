var mongoose = require('mongoose');

var TileSchema = new mongoose.Schema({
  _id: String,
  active: Boolean,
  state: String,
  user: { type: String, ref: 'User' }
});

mongoose.model('Tile', TileSchema);