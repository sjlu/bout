var models = require('../models');
var jawbone = require('../lib/jawbone');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');
var kue = require('../lib/kue');

module.exports = function(job, done) {
  var uid = job.data.uid;

  console.log('connection:', 'jawbone', uid);

  async.waterfall([
    function(cb) {
      models.User.findById(uid, cb);
    },
    function(user, cb) {
      jawbone.getUser(user, function(err, data) {
        if (err) return cb(err);
        user.jawbone_id = data.xid;

        var start = moment().subtract(7, 'days').startOf('day');
        var end = moment().add(1, 'day').startOf('day');

        user.save(cb);
      });
    },
    function(user, cb) {
      async.each(_.range(0,8), function(days, cb) {
        var date = moment().subtract(days, 'days').startOf('day').format('X');

        kue.create('updateJawbone', {
          jawbone_id: user.jawbone_id,
          timestamp: date
        }).save(cb);
      }, cb);
    }
  ], function(err) {
    if (err) return done(err);
    done();
  });
}