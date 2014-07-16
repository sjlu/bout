var _ = require('lodash');

var adminEmails = [
  "tacticalazn@gmail.com",
  "jasonc101@gmail.com"
]

module.exports = function(req, res, next) {
  if (!req.user || !req.user.email) return next(401);

  if (_.contains(adminEmails, req.user.email)) {
    return next();
  }

  return next(401);
}