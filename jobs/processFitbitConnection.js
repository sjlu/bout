var models = require('../models');
var fitbit = require('../lib/fitbit');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');
var kue = require('../lib/kue');

module.exports = function(job, done) {
  var uid = job.data.uid;

  console.log('connection:', 'fitbit', uid);

  async.waterfall([
    function(cb) {
      models.User.findById(uid, cb);
    },
    function(user, cb) {
      async.parallel({
        user: function(cb) {
          fitbit.getUser(user, function(err, data) {
            if (err) return cb(err);
            user.fitbit_id = data.encodedId;
            user.save(cb);
          });
        },
        subscribe: function(cb) {
          fitbit.subscribe(user, cb);
        }
      }, function(err) {
        if (err) return cb(err);
        cb(null, user);
      });
    },
    function(user, cb) {
      var start = moment().subtract(7, 'days').startOf('day');
      async.each(_.range(0,8), function(days, cb) {
        var date = moment(start).add(days, 'days').format('YYYY-MM-DD');
        kue.create('updateFitbit', {
          fitbit_id: user.fitbit_id,
          date: date
        }).save(cb);
      }, cb);
    }
  ], function(err) {
    if (err) return done(err);
    done();
  });

}