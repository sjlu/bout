var email = require('../lib/email');

module.exports = function(job, done) {
  email.send(job.data.template, job.data.params, done);
}