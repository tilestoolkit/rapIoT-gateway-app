var mongoose = require('mongoose');

var WebhookSchema = new mongoose.Schema({
  postUrl: String,
  //event: String,
  user: { type: String, ref: 'User' },
  tile: { type: String, ref: 'Tile' }
});

mongoose.model('Webhook', WebhookSchema);