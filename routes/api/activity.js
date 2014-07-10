var express = require('express');
var router = express.Router();
var models = require('../../models');

router.get('/', function(req, res, next) {
  models.Activity.find({
    _uid: req.user._id
  }, function(err, activity) {
    if (err) return next(err);
    res.json(activity);
  });
});

module.exports = router;