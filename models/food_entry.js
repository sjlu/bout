var mongoose = require('../lib/mongoose');
var _ = require('lodash');

var FoodEntry = new mongoose.Schema({
  _uid: {
    type: String,
    required: true,
    index: true
  },
  _fid: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('FoodEntry', FoodEntry);