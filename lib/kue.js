var config = require('./config');
var kue = require('kue');
var redis = require('./redis');

var jobs = kue.createQueue({
  redis: {
    host: config.REDIS_HOSTNAME,
    port: config.REDIS_PORT,
    auth: config.REDIS_PASSWORD
  }
});

// remove job on completion
jobs.on('job complete', function(id) {
  kue.Job.get(id, function(err, job) {
    if (err) return;
    job.remove(function(err) {
      if (err) throw err;
    });
  });
});

// failure
jobs.on('job failed', function(id) {
  kue.Job.get(id, function(err, job) {
    if (err) return;
    console.error("kue failure:", job.type, JSON.stringify(job));
  });
});

module.exports = jobs;