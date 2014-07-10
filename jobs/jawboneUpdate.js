var models = require('../models');
var jawbone = require('../lib/jawbone');
var moment = require('moment');
var async = require('async');

module.exports = function(job, done) {
  var jawbone_id = job.data.jawbone_id;
  var timestamp = job.data.timestamp;
  var start = moment.unix(timestamp*1).startOf('day').format('X');
  var end = moment.unix(timestamp*1).add(1, 'day').startOf('day').format('X');

  console.log("processing jawbone update", jawbone_id, start, end);

  async.waterfall([
    function(cb) {
      models.User.findOne({
        jawbone_id: jawbone_id
      }, cb);
    },
    function(user, cb) {
      jawbone.getSteps(start, end, user, function(err, data) {
        async.each(data, function(day, cb) {
          models.Activity.findOrCreate(user, day.date, function(err, act) {
            console.log('update:', user._id, day.date, day.steps);
            if (day.steps) {
              act.steps = day.steps;
            }
            act.save(cb);
          });
        }, cb);
      });
    }
  ], done);

}