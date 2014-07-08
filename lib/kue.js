var config = require('./config');
var url = require('url');
var kue = require('kue');
var jobs;

if (config.REDIS_URL) {
  var parts = url.parse(config.REDIS_URL);
  jobs = kue.createQueue({
    redis: {
      host: parts.hostname,
      port: parts.port,
      auth: parts.auth
    }
  });
} else {
  jobs = kue.createQueue();
}

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