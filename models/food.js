var mongoose = require('../lib/mongoose');
var _ = require('lodash');

var Food = new mongoose.Schema({
  _uid: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  calories: {
    type: Number,
    required: true,
    default: 0
  },
  fats: {
    type: Number,
    required: true,
    default: 0
  },
  carbs: {
    type: Number,
    required: true,
    default: 0
  },
  protein: {
    type: Number,
    required: true,
    default: 0
  },
  serving_size: {
    type: Number,
    required: true,
    default: 1
  },
  serving_type: {
    type: String,
    required: true,
    enum: ["oz", "lb", "g"],
    default: "pound"
  },
  notes: {
    type: String
  }
});

Food.virtual('serving').get(function() {
  var retVal = this.serving_size + " " + this.serving_type;
  return retVal;
});

Food.statics.getFoodsForUser = function(user, cb) {
  this.find({
    _uid: user._id
  }, cb);
}

Food.statics.createFoodForUser = function(user, fields, cb) {
  fields = _.pick(fields, [
    "name",
    "calories",
    "fats",
    "carbs",
    "protein",
    "serving_size",
    "serving_type"
  ]);

  // assign it to a user id
  fields._uid = user.id;

  var food = new this(fields);
  food.save(cb);
}

Food.method('toJSON', function() {
  var food = this.toObject({virtuals: true});
  return food;
});

module.exports = mongoose.model('Food', Food);