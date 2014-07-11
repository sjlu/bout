var mongoose = require('../lib/mongoose');

var Activity = new mongoose.Schema({
  _uid: {
    type: String,
    required: true
  },
  date: {
    type: Number,
    required: true
  },
  steps: {
    type: Number,
    required: true,
    default: 0
  }
});

Activity.statics.findOrCreate = function(user, date, cb) {
  var self = this;

  this.findOne({
    _uid: user._id,
    date: date
  }, function(err, activity) {
    if (err) return cb(err);
    if (!activity) {
      activity = new self({
        _uid: user._id,
        date: date
      });
    }
    cb(null, activity);
  });
};

Activity.statics.updateStepsForUserOnDate = function(user, date, steps, cb) {
  this.findOrCreate(user, date, function(err, activity) {
    console.log('activity update:', user._id, date, steps);
    if (steps) {
      activity.steps = steps;
    }
    activity.save(cb);
  });
}

Activity.index({_uid: 1, date: 1}, {unique: true});

module.exports = mongoose.model('Activity', Activity);