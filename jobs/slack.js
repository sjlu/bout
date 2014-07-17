module.exports = function(job, done) {
  var data = job.data;
  var text = data.text;

  slack.send({
    text: text
  }, done);
}