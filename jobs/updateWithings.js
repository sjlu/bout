var models = require('../models');
var withings = require('../lib/withings');
var moment = require('moment');
var async = require('async');

module.exports = function(job, done) {
  var withings_id = job.data.withings_id;
  var start_date = moment(job.data.start_date, 'YYYY-MM-DD');
  var end_date = moment(job.data.end_date, 'YYYY-MM-DD');


  async.waterfall([
    function(cb) {
      models.User.findOne({
        withings_id: withings_id
      }, cb);
    },
    function(user, cb) {
      if (!user) return cb(new Error("no user by that withings_id: " + withings_id));
      
      var momentPointer = moment(start_date);
      var datesToCheck = [];
      while (!momentPointer.isAfter(end_date)) {
        datesToCheck.push(momentPointer.format('YYYY-MM-DD'));
        momentPointer.add(1, 'day');
      }
      async.each(datesToCheck, function(date, cb) {
        console.log('update:', 'withings', withings_id, date);
        withings.getSteps(user, date, function(err, data) {
          if (err) return cb(err);
          date = moment(data.date).format('YYYYMMDD');
          models.Activity.updateStepsForUserOnDate(user, date, data.steps, cb);
        });
      }, cb);
    }
  ], done);

}
