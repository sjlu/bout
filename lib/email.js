var path = require('path');
var mandrill = require('./mandrill');
var emailTemplates = require('email-templates');
var kue = require('../lib/kue');
var config = require('./config');

var renderTemplate = function(templateName, params, cb) {
  params = params || {};
  params.host = params.host || config.URL;
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

module.exports.send = function(template, params, cb) {
  if (!types[template]) return cb(new Error("No method found"));
  types[template](params, cb);
}

module.exports.create = function(template, params, cb) {
  kue.create('email', {
    template: template,
    params: params
  }).save(cb);
}

module.exports.preview = function(template, params, cb) {
  renderTemplate(template, params, cb);
}