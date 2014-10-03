var express = require('express');
var router = express.Router();
var leaderboards = require('../../lib/leaderboards');
var async = require('async');
var moment = require('moment');
var _ = require('lodash');
var activities = require('../../lib/activities');
var date = require('../../lib/date');
var models = require('../../models');

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
          steps: data[i].steps,
          total: data.length
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

router.get('/track', function(req, res, next) {
  var start = req.query.start_on || date.getDate();

  async.parallel({
    this_week: function(cb) {
      activities(req.user, {
        start_on: moment(start, 'YYYYMMDD').add(1, 'week').startOf('week').format('YYYYMMDD'),
        days_back: 7
      }, cb);
    },
    last_week: function(cb) {
      activities(req.user, {
        start_on: moment(start, 'YYYYMMDD').startOf('week').format('YYYYMMDD'),
        days_back: 7
      }, cb);
    }
  }, function(err, data) {
    var oneWeekAgo = moment(start, 'YYYYMMDD').subtract(1, 'week').format('YYYYMMDD');

    var todayTotalSteps = _.find(data.this_week, {date:''+start});
    var oneWeekAgoTotalSteps = _.find(data.last_week, {date:oneWeekAgo});

    data.on_track = todayTotalSteps.total - oneWeekAgoTotalSteps.total;

    if (err) return next(err);
    res.json(data);
  });

});

router.get('/food/summary', function(req, res, next) {
  models.FoodEntry.getEntriesForUser(req.user, req.query, function(err, entries) {
    if (err) return next(err);
    var summary = {
      calories: 0,
      fats: 0,
      carbs: 0,
      protien: 0,
    };
    _.each(entries, function(entry) {
      _.each(_.keys(summary), function(k) {
        summary[k] += entry.nutrition[k];
      });
    });
    res.json(summary);
  });
});

router.get('/food/entries', function(req, res, next) {
  models.FoodEntry.getEntriesForUser(req.user, req.query, function(err, entries) {
    if (err) return next(err);
    res.json(entries);
  });
});

router.post('/food/entries', function(req, res, next) {
  models.FoodEntry.createEntryForUser(req.user, req.body, function(err, entry) {
    if (err) return next(err);
    res.json(entry);
  });
});

module.exports = router;
