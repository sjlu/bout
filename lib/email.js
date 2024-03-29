var path = require('path');
var mandrill = require('./mandrill');
var emailTemplates = require('email-templates');
var kue = require('../lib/kue');
var config = require('./config');
var async = require('async');
var models = require('../models');
var _ = require('lodash');

var renderTemplate = function(templateName, user, params, cb) {
  params = params || {};
  params.host = params.host || config.URL;
  params.user = user;
  emailTemplates(path.join(__dirname, '../views/emails'), function(err, template) {
    if (err) return cb(err);
    template(templateName, params, cb);
  });
}

var send = function(to, subject, html, cb) {
  mandrill.send({
    to: to,
    subject: subject,
    html: html
  }, cb);
}

// email types get registered here.
var types = {};
types.friendRequest = function(params, cb) {
  if (!params.pid) return cb(new Error("A pair ID was expected"));
  models.Pair.findById(params.pid, function(err, pair) {
    if (err) return cb(err);
    models.User.find({
      _id: {$in:[pair.uid1, pair.uid2]}
    }, function(err, users) {
      if (err) return cb(err);

      var from, to;
      _.each(users, function(user) {
        if (pair.uid1 == user._id) {
          from = user;
        } else if (pair.uid2 == user._id) {
          to = user;
        }
      });

      renderTemplate('friendRequest', to, {
        from: from,
        to: to
      }, function(err, html) {
        if (err) return cb(err);
        send(to.email, from.username + ' wants to be your friend!', html, cb);
      });
    });
  });
};

module.exports.send = function(template, params, cb) {
  if (!types[template]) return cb(new Error("No method found"));
  console.log("email sent", user.email, template, params);
  types[template](params, user, cb);
}

module.exports.create = function(template, params, cb) {
  kue.create('email', {
    template: template,
    params: params
  }).save(cb);
}

module.exports.preview = function(template, params, cb) {
  renderTemplate(template, {}, params, cb);
}