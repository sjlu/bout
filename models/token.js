var mongoose = require('../lib/mongoose');

var Token = new mongoose.Schema({
  _uid: {
    type: String,
    require: true,
    index: true
  }
});

module.exports = mongoose.model('Token', Token);