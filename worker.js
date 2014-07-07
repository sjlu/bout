var kue = require('./lib/kue');
var jobs = require('./jobs');
var _ = require('lodash');

_.each(jobs, function(job, key) {
  kue.process(key, job);
});