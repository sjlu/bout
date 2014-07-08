var models = require('../models');

module.exports = function(req, res, next) {
  console.log(req.session);
  models.User.findOne({
    id: req.session.user
  }, function(err, user) {
    if (err) return next(err);
    req.user = user;
  });
}