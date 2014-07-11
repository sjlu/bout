var models = require('../models');
var jawbone = require('../lib/jawbone');
var moment = require('moment');
var async = require('async');

module.exports = function(job, done) {
  var jawbone_id = job.data.jawbone_id;
  var timestamp = job.data.timestamp;

  console.log("update:", 'jawbone', jawbone_id, timestamp);

  var start = moment.unix(timestamp*1).startOf('day').format('X');
  var end = moment.unix(timestamp*1).add(1, 'day').startOf('day').format('X');

  async.waterfall([
    function(cb) {
      models.User.findOne({
        jawbone_id: jawbone_id
      }, cb);
    },
    function(user, cb) {
      jawbone.getSteps(start, end, user, function(err, data) {
        async.each(data, function(day, cb) {
          models.Activity.updateStepsForUserOnDate(user, day.date, day.steps, cb);
        }, cb);
      });
    }
  ], done);

}