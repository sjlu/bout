var models = require("../models");
var _ = require('lodash');

module.exports.friendsForUser = function(user, cb) {
  models.Pair.findFriendsForUser(user, function(err, ids) {
    if (err) return cb(err);
    models.User.find({
      _id: {$in:ids}
    }, cb);
  });
}

module.exports.pendingForUser = function(user, cb) {
  models.Pair.findRequestsForUser(user, function(err, pairs) {
    if (err) return cb(err);
    if (!pairs.length) return cb(null, []);

    var keyPairs = {};
    _.each(pairs, function(pair) {
      keyPairs[pair.uid] = pair;
    });

    models.User.find({
      _id: {$in:_.keys(keyPairs)}
    }, function(err, users) {
      if (err) return cb(err);
      users = _.map(users, function(user) {
        user = user.toJSON();
        user.made = keyPairs[user._id].made;
        user.pid = keyPairs[user._id].id;
        return user;
      });
      cb(null, users);
    });
  });
}