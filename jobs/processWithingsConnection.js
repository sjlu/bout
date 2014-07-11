var models = require('../models');
var withings = require('../lib/withings');
var moment = require('moment');
var async = require('async');
var _ = require('lodash');
var kue = require('../lib/kue');

// this will subscribe to the appropriate
// modules that we need to listen to and
// backfill days in the past.
module.exports = function(job, done) {
  var uid = job.data.uid;

  console.log('connection:', 'withings', uid);

  models.User.findById(uid, function(err, user) {
    if (err) return done(err);
    async.parallel([
      function(cb) {
        withings.subscribe(user, cb);
      },
      function(cb) {
        async.each(_.range(0, 7), function(day, cb) {
          var date = moment().subtract(day, 'day').format('X');
          kue.create('updateWithings', {
            withings_id: user.withings_id,
            start_date: date,
            end_date: date
          }).save(cb);
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