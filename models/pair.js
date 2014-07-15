var mongoose = require('../lib/mongoose');
var _ = require('lodash');
var userModel = require('./user');
var async = require('async');

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
      if (f.uid1 == user._id) {
        return f.uid2;
      } else {
        return f.uid1;
      }
    });
    cb(null, friendIds);
  });
}

Pair.statics.findRequestsForUser = function(user, cb) {
  this.find({
    pending: true
  }).or([
    {uid1:user._id},
    {uid2:user._id}
  ]).exec(function(err, friends) {
    if (err) return cb(err);

    var friends = _.map(friends, function(friend) {
      var uid = friend.uid1;
      var made = false;
      if (uid == user._id) {
        uid = friend.uid2;
        made = true;
      }

      return {
        id: friend._id,
        uid: uid,
        made: made
      };
    });

    cb(null, friends);
  });
}

Pair.statics.createPair = function(user, uid, cb) {
  var self = this;

  if (user._id == uid) return cb(new Error("Pair cannot be of equal users"));

  async.series([
    function(cb) {
      self.find().or([
        {uid1:uid, uid2:user._id},
        {uid1:user._id, uid2:uid}
      ]).exec(function(err, pair) {
        if (err) return cb(err);
        if (pair && pair.length) return cb(new Error("Pair already exists"));
        cb();
      });
    }
  ], function(err) {
    if (err) return cb(err);
    self({
      uid1: user._id,
      uid2: uid
    }).save(cb);
  })

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