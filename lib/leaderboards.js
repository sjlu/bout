var models = require('../models');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');

var getDate = function(days, start) {
  var mnt;
  if (start) {
    mnt = moment(start, 'YYYYMMDD');
  } else {
    mnt = moment();
  }
  if (days) {
    mnt = mnt.subtract(days, 'days');
  }
  mnt = mnt.startOf('day');
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

module.exports = function(user, opts, cb) {
  opts = _.defaults(opts, {
    days_back: 7,
    start_on: getDate()
  });

  getFriendIds(user, function(err, ids) {
    async.parallel({
      board: function(cb) {

        // all ids are matched
        var $match = {
          _uid: { $in: ids }
        };

        // build the time query
        $match.date = {
          $lte: getDate(0, opts.start_on),
          $gt: getDate(opts.days_back, opts.start_on)
        };

        // what do we want to aggregate by
        var $group = {
          _id: '$_uid',
          steps: {$sum: '$steps'}
        };

        // this is the base object
        // where we place query objs
        // into
        var query = [{$match:$match}, {$group:$group}];

        // run
        models.Activity.aggregate(query).exec(function(err, data) {
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