var models = require('../models');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');

var getDate = function(amt, type) {
  var mnt = moment();
  if (amt && type) {
    mnt.subtract(amt, 'days');
  }
  mnt.startOf('day');
  return parseInt(mnt.format('YYYYMMDD'));
}

var getFriendIds = function(user, cb) {
  models.Pair.findFriendsForUser(user, function(err, ids) {
    if (err) return next(err);
    ids = ids || [];
    ids.push(""+user._id);
    cb(null, ids);
  });
}

var boards = {};
boards.weeklySteps = function(ids, cb) {
  var past = getDate(7, 'days');
  var today = getDate();

  models.Activity.aggregate([
    {
      $match: {
        _uid: { $in: ids },
        date: {
          $gte: past,
          $lte: today
        }
      },
    },
    {
      $group: {
        _id: '$_uid',
        steps: {$sum: '$steps'}
      }
    }
  ]).exec(cb);
};

module.exports = function(type, user, cb) {
  getFriendIds(user, function(err, ids) {
    async.parallel({
      board: function(cb) {
        boards[type](ids, function(err, data) {
          if (err) return cb(err);
          var map = {};
          _.each(data, function(pos) {
            map[pos._id] = pos.steps;
          });
          cb(null, map);
        });
      },
      users: function(cb) {
        models.User.find({
          _id: {$in:ids}
        }, function(err, users) {
          if (err) return cb(err);
          users = _.map(users, function(user) {
            return user.toJSON();
          });
          cb(null, users);
        });
      }
    }, function(err, data) {
      if (err) return cb(err);
      var users = data.users;
      var board = data.board;

      for (var i = 0; i < users.length; i++) {
        users[i].steps = board[users[i]._id] || 0;
      }

      users = _.sortBy(users, function(user) { return user.steps * -1; });

      cb(null, users);
    });
  });
}