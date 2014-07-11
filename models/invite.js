var mongoose = require('../lib/mongoose');

var Invite = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: {
      unique: true
    }
  }
});

module.exports = mongoose.model('Invite', Invite);