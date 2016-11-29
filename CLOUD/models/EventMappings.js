var mongoose = require('mongoose');

var EventMappingsSchema = new mongoose.Schema({
  eventMappings: Object,
  user: { type: String, ref: 'User' },
  tile: { type: String, ref: 'Tile' }
});

EventMappingsSchema.index({ user: 1, tile: 1 }, { unique: true });

mongoose.model('EventMappings', EventMappingsSchema);