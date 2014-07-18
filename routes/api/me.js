var express = require('express');
var router = express.Router();
var leaderboards = require('../../lib/leaderboards');
var async = require('async');
var moment = require('moment');
var _ = require('lodash');

router.get('/', function(req, res, next) {
  res.json(req.user);
});

router.put('/', function(req, res, next) {
  req.user.updateInfo(req.body, function(err, user) {
    if (err) return next(err);
    res.json(user);
  });
});

var userStats = function(user, q, cb) {
  leaderboards(user, q, function(err, data) {
    if (err) return cb(err);
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == user.id) {
        return cb(null, {
          pos: i+1,
          steps: data[i].steps
        });
      }
    }
    cb();
  });
}

router.get('/stats', function(req, res, next) {
  var leaderboardQuery = {};
  if (req.query.start_on) {
    leaderboardQuery.start_on = req.query.start_on;
  }

  async.parallel({
    day: function(cb) {
      var q = _.clone(leaderboardQuery);
      q.days_back = 1;
      userStats(req.user, q, cb);
    },
    week: function(cb) {
      var q = _.clone(leaderboardQuery);
      q.days_back = 7;
      userStats(req.user, q, cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

module.exports = router;
