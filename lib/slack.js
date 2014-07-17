var Slackhook = require('slackhook');
var config = require('./config');
var _ = require('lodash');
var kue = require('./kue');

var slackhook = new Slackhook({
  domain: config.SLACK_DOMAIN,
  token: config.SLACK_TOKEN
});

module.exports.send = function(obj, cb) {
  // no unnecessary messages please
  if (config.ENV !== "production") {
    return cb();
  }

  obj = _.defaults(obj, {
    username: config.SLACK_USERNAME,
    channel: config.SLACK_CHANNEL
  });

  // send
  slackhook.send(obj, function(err, response) {
    if (err) return cb(err);
    return cb(null, response);
  });
};

module.exports.create = function(text, cb) {
  kue.create('slack', {
    text: text
  }).save(cb);
}

module.exports.respond = slackhook.respond;