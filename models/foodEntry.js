var mongoose = require('../lib/mongoose');
var _ = require('lodash');
var convert = require('convert-units');

var FoodEntry = new mongoose.Schema({
  _uid: {
    type: String,
    required: true,
    index: true
  },
  _fid: {
    type: String,
    required: true,
    ref: 'Food'
  },
  eaten_at: {
    type: Date,
    index: true
  },
  serving_size: {
    type: Number,
    required: true
  },
  serving_type: {
    type: String,
    enum: ["oz", "lb", "g"]
  }
});

FoodEntry.pre('save', function(next) {
  if (!this.eaten_at) {
    this.eaten_at = new Date();
  }
  next();
});

FoodEntry.virtual('nutrition').get(function() {
  var self = this;

  if ("object" !== typeof(this._fid)) {
    return {};
  }

  var amountInFood = convert(this.serving_size).from(this.serving_type).to(this._fid.serving_type);
  var factor = amountInFood / this._fid.serving_size;

  var nutrition = {};

  _.each([
    "calories",
    "fats",
    "carbs",
    "protein"
  ], function(type) {
    nutrition[type] = Math.round(factor * self._fid[type] * 10) / 10
  });

  return nutrition;
});

FoodEntry.statics.getEntriesForUser = function(user, cb) {
  this.find({
    _uid: user.id
  }).populate('_fid').exec(cb);
}

FoodEntry.statics.createEntryForUser = function(user, fields, cb) {
  // only these fields can go through
  fields = _.pick(fields, [
    "_fid",
    "eaten_at",
    "serving_size",
    "serving_type"
  ]);

  // associate the id
  fields._uid = user.id;

  var entry = new this(fields);
  entry.save(cb);
}

FoodEntry.method('toJSON', function() {
  return this.toObject({virtuals: true});
});

module.exports = mongoose.model('FoodEntry', FoodEntry);

