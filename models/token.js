var mongoose = require('../lib/mongoose');
var uid = require('uid');

var Token = new mongoose.Schema({
  _uid: {
    type: String,
    require: true
  },
  token: {
    type: String,
    require: true,
    index: {
      unique: true
    },
    default: function() {
      return uid(24);
    }
  }
});

module.exports = mongoose.model('Token', Token);