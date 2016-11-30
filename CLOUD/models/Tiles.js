var mongoose = require('mongoose');

var TileSchema = new mongoose.Schema({
  _id: String,
  name: String,
  active: Boolean,
  state: Object,
  user: { type: String, ref: 'User' }
});

mongoose.model('Tile', TileSchema);