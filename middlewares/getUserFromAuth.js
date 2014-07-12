var models = require('../models');
var async = require('async');

module.exports = function(req, res, next) {
  // first see
  if (req.session.uid) {
    models.User.findOne({
      _id: req.session.uid
    }, function(err, user) {
      if (err) return next(err);
      req.user = user;
      next();
    });
  } else if (req.headers['authentication-token']) {
    async.waterfall([
      function(cb) {
        models.Token.findOne({
          token: req.headers['authentication-token']
        }, cb);
      },
      function(token, cb) {
        if (!token) {
          return cb();
        }

        models.User.findById(token._uid, cb);
      },
      function(user, cb) {
        if (!user) {
          return cb();
        }

        req.user = user;
        cb();
      }
    ], next);
  } else {
    next();
  }

}