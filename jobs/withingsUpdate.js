var models = require('../models');
var withings = require('../lib/withings');
var moment = require('moment');
var async = require('async');

module.exports = function(job, done) {
  var withings_id = job.data.withings_id;
  var start_date = moment(job.data.start_date).format('YYYY-MM-DD');
  var end_date = moment(job.data.end_date).format('YYYY-MM-DD');

  async.waterfall([
    function(cb) {
      models.User.findOne({
        withings_id: withings_id
      }, cb);
    },
    function(user, cb) {
      var momentPointer = moment(start_date);
      var datesToCheck = [];
      while (!momentPointer.isAfter(end_date)) {
        datesToCheck.push(momentPointer.format('YYYY-MM-DD'));
        momentPointer.add(1, 'day');
      }
      async.each(datesToCheck, function(date, cb) {
        withings.getSteps(user, date, function(err, data) {
          if (err) return cb(err);
          date = moment(data.date).format('YYYYMMDD');
          models.Activity.findOrCreate(user, date, function(err, activity) {
            activity.steps = data.steps;
            activity.save(cb);
          });
        });
      });
    }
  ], done);

}