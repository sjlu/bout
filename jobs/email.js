var email = require('../lib/email');

module.exports = function(job, done) {
  mailer.send(job.data.template, job.data.params, done);
}