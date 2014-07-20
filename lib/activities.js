var models = require('../models');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');
var date = require('./date');

module.exports = function(user, opts, cb) {
  opts = _.defaults(opts, {
    days_back: 7,
    start_on: date.getDate()
  });

  var end = date.getDate(0, opts.start_on);
  var start = date.getDate(opts.days_back, opts.start_on);

  // get activities
  models.Activity.find({
    date: {
      $lte: end,
      $gt: start
    }
  }, function(err, activities) {
    if (err) return cb(err);

    var activitiesMap = {};
    _.each(activities, function(activity) {
      activitiesMap[''+activity.date] = activity;
    });

    var dateToSteps = [];
    var startMoment = moment(start, 'YYYYMMDD');
    var endMoment = moment(end, 'YYYYMMDD');
    var sum = 0;
    while (startMoment.isBefore(endMoment)) {
      var date = startMoment.format('YYYYMMDD');
      var steps = 0;
      if (activitiesMap[date] && activitiesMap[date].steps) {
        steps = activitiesMap[date].steps;
      }
      sum += steps;
      dateToSteps.push({
        date: date,
        steps: steps,
        total: sum
      });
      startMoment.add(1, 'day');
    }

    cb(null, dateToSteps);
  });
}