var express = require('express');
var router = express.Router();
var models = require('../../models');
var _ = require('lodash');

router.get('/search', function(req, res, next) {
  if (!req.query.query) {
    return next(new Error("Expected something to search"));
  }

  models.User.searchForUser(req.query.query, function(err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

module.exports = router;