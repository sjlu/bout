var express = require('express');
var router = express.Router();
var models = require('../../models');
var _ = require('lodash');

router.get('/search', function(req, res, next) {
  if (!req.query.query) {
    return next(new Error("Expected something to search"));
  }

  models.User.textSearch(req.query.query, function(err, output) {
    if (err) return next(err);

    output = _.map(output.results, function(user) {
      return {
        score: user.score,
        username: user.obj.username,
        gravatar: user.obj.gravatar,
        _id: user.obj.id
      }
    });

    res.json(output);
  });
});

module.exports = router;