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
  size: {
    type: String,
    required: true,
    enum: ["cups", "ounces", "pounds", "servings"],
    default: "servings"
  }
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
    "size"
  ]);

  // assign it to a user id
  fields._uid = user.id;

  var food = new this(fields);
  food.save(cb);
}

module.exports = mongoose.model('Food', Food);