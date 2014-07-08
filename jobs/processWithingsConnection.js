var models = require('../models');
var withings = require('../lib/withings');
var moment = require('moment');
var async = require('async');
var _ = require('lodash');

// this will subscribe to the appropriate
// modules that we need to listen to and
// backfill days in the past.
module.exports = function(job, done) {
  var uid = job.data.uid;
  models.User.findOne({
    _id: uid
  }, function(err, user) {
    if (err) return done(err);
    async.parallel([
      function(cb) {
        withings.subscribe(user, cb);
      },
      function(cb) {
        async.each(_.range(0, 7), function(day, cb) {
          withings.getSteps(user, moment().subtract(day, 'day').format('YYYY-MM-DD'), function(err, data) {
            if (err) return cb(err);
            var date = moment(data.date).format('YYYYMMDD');
            models.Activity.findOrCreate(user, date, function(err, activity) {
              activity.steps = data.steps;
              activity.save(cb);
            });
          });
        }, function(err) {
          if (err) return cb(err);
          cb();
        });
      }
    ], function(err) {
      if (err) return done(err);
      done();
    });
  });
}