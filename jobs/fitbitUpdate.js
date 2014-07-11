var models = require('../models');
var fitbit = require('../lib/fitbit');
var moment = require('moment');
var async = require('async');

module.exports = function(job, done) {
  var fitbit_id = job.data.fitbit_id;
  var date = job.data.date;

  console.log("processing fitbit update", fitbit_id, date);

  async.waterfall([
    function(cb) {
      models.User.findOne({
        fitbit_id: fitbit_id
      }, cb);
    },
    function(user, cb) {
      fitbit.getSteps(date, user, function(err, data) {
        models.Activity.findOrCreate(user, data.date, function(err, act) {
          console.log('update:', user._id, data.date, data.steps);
          if (data.steps) {
            act.steps = data.steps;
          }
          act.save(cb);
        });
      });
    }
  ], done);

}