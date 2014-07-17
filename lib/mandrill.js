var mandrill = require('mandrill-api');
var config = require('./config');
var client = new mandrill.Mandrill(config.MANDRILL_APIKEY);

module.exports.send = function(opts, cb) {
  opts = opts || {};
  if (!opts.html) return cb(new Error("No message provided"));
  if (!opts.subject) return cb(new Error("No subject provided"));
  if (!opts.to) return cb(new Error("No recipient email"));

  var message = {
    html: opts.html,
    subject: opts.subject,
    from_email: 'noreply@' + config.DOMAIN,
    from_name: 'bout',
    to: []
  };

  // don't send to the actual person if
  // we're on the staging environment
  if (config.ENV !== "production") {
    message.to.push({
      'email': 'slu@me.com'
    });
  } else {
    message.to.push({
      'email': opts.to
    });
  }

  client.messages.send({
    "message": message
  }, function(result) {
    if ("function" === typeof cb) {
      cb(null, result);
    }
  }, function(err) {
    if ("function" === typeof cb) {
      cb(err);
    }
  });

};