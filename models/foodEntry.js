var mongoose = require('../lib/mongoose');
var _ = require('lodash');
var convert = require('convert-units');
var moment = require('moment');

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
  eaten_at_date: {
    type: Number,
    index: true
  },
  eaten_at_time: {
    type: Number,
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
  if (!this.eaten_at_date && !this.eaten_at_time) {
    var rightNow = moment();
    this.eaten_at_date = rightNow.format('YYYYMMDD');
    this.eaten_at_time = rightNow.format('HHmm');
  }

  if (!this.eaten_at_date || !this.eaten_at_time) {
    return next(new Error("`eaten_at_date` and `eaten_at_time` must be provided together"));
  }

  // round to the nearest 15 minute mark
  if (this.isModified('eaten_at_time')) {
    var time = moment(this.eaten_at_time, 'HHmm');

    var remainder = time.minute() % 15;
    time.subtract('minutes', remainder).add('minutes', remainder > 7 ? 15 : 0);

    this.eaten_at_time = time.format('HHmm');
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

FoodEntry.statics.getEntriesForUser = function(user, opts, cb) {
  var where = {
    _uid: user.id,
  };

  if (opts.date) {
    where.eaten_at_date = opts.date;
  }

  this.find(where).populate('_fid').exec(cb);
}

FoodEntry.statics.createEntryForUser = function(user, fields, cb) {
  // only these fields can go through
  fields = _.pick(fields, [
    "_fid",
    "eaten_at_date",
    "eaten_at_time",
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

