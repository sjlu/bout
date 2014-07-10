var models = require('../models');
var jawbone = require('../lib/jawbone');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');

module.exports = function(job, done) {
  var uid = job.data.uid;

  console.log('processing new jawbone connection', uid);

  async.waterfall([
    function(cb) {
      models.User.findById(uid, cb);
    },
    function(user, cb) {
      async.parallel({
        data: function(cb) {
          jawbone.getUser(user, function(err, data) {
            if (err) return cb(err);
            user.jawbone_id = data.xid;
            user.save(cb);
          });
        },
        steps: function(cb) {
          var start = moment().subtract(7, 'days').startOf('day');
          var end = moment().add(1, 'day').startOf('day');
          jawbone.getSteps(start.format('X'), end.format('X'), user, cb);
        }
      }, function(err, data) {
        async.each(data.steps, function(day, cb) {
          models.Activity.findOrCreate(user, day.date, function(err, act) {
            if (day.steps) {
              act.steps = day.steps;
            }
            act.save(cb);
          })
        }, cb);
      });
    }
  ], function(err) {
    if (err) return done(err);
    done();
  });

}