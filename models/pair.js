var mongoose = require('../lib/mongoose');
var _ = require('lodash');
var userModel = require('./user');

var Pair = new mongoose.Schema({
  uid1: {
    type: String,
    require: true,
    index: true
  },
  uid2: {
    type: String,
    require: true,
    index: true
  },
  pending: {
    type: Boolean,
    require: true,
    default: true
  }
});

Pair.statics.findFriendsForUser = function(user, cb) {
  this.find({
    pending: false,
  }).or([
    {uid1:user._id},
    {uid2:user._id}
  ]).exec(function(err, friends) {
    if (err) return cb(err);
    var friendIds = _.map(friends, function(f) {
      if (f.uid1 === user._id) {
        return f.uid2;
      } else {
        return f.uid2;
      }
    });
    cb(null, friendIds);
  });
}

Pair.statics.findRequestsForUser = function(user, cb) {
  this.find({
    pending: false,
    uid2:user._id
  }, function(err, friends) {
    if (err) return cb(err);
    cb(null, _.pluck(friends, "uid1"));
  });
}

var userExists = function(uid, cb) {
  userModel.findById(uid, function(err, user) {
    if (err || !user) return cb(false);
    cb(true);
  });
};

Pair.path('uid1').validate(userExists, 'uid1 does not exist');
Pair.path('uid2').validate(userExists, 'uid2 does not exist');

module.exports = mongoose.model('Pair', Pair);