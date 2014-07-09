var config = require('./config');
var url = require('url');
var kue = require('kue');
var redis = require('./redis');

kue.redis.createClient = function() {
  return redis;
};

var jobs = kue.createQueue();

// remove job on completion
jobs.on('job complete', function(id) {
  kue.Job.get(id, function(err, job) {
    if (err) return;
    job.remove(function(err) {
      if (err) throw err;
    });
  });
});

module.exports = jobs;