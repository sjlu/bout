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
  measure: {
    type: Number,
    required: true,
    default: 1
  },
  measure_type: {
    type: String,
    required: true,
    enum: ["ounce", "pound", "gram"],
    default: "pound"
  },
  notes: {
    type: String
  }
});

Food.virtual('serving_size').get(function() {
  var retVal = this.measure + " " + this.measure_type;
  if (this.measure !== 1) {
    retVal += "s";
  }
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
    "measure",
    "measure_type"
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