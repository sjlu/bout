var models = require('../models');

module.exports = function(req, res, next) {
  models.User.findOne({
    _id: req.session.uid
  }, function(err, user) {
    if (err) return next(err);
    req.user = user;
    next();
  });
}