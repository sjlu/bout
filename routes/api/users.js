var express = require('express');
var router = express.Router();
var models = require('../../models');

router.get('/search', function(req, res, next) {
  if (!req.query.query) {
    return next(new Error("Expected something to search"));
  }

  models.User.textSearch(req.query.query, function(err, output) {
    if (err) return next(err);
    res.json(output);
  });
});

module.exports = router;