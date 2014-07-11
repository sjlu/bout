var models = require('../models');

module.exports.authenticate = function(username, password, cb) {
  models.User.findOne({
    username: username
  }, function(err, user) {
    if (err) return next(err);
    if (!user) {
      return cb();
    }
    user.authenticate(password, function(err, match) {
      if (err) return next(err);
      if (!match) {
        return cb();
      }
      cb(null, user._id);
    });
  });
}

module.exports.createToken = function(uid, cb) {
  models.Token.create({
    _uid: uid
  }).save(function(err, token) {
    if (err) return cb(err);
    cb(null, token._id);
  });
}