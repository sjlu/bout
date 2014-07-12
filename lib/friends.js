var models = require("../models");

module.exports.friendsForUser = function(user, cb) {
  models.Pair.findFriendsForUser(user, function(err, ids) {
    models.User.find({
      _id: ids
    }, cb);
  });
}