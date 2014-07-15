var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json(req.user);
});

router.put('/', function(req, res, next) {
  req.user.updateInfo(req.body, function(err, user) {
    if (err) return next(err);
    res.json(user);
  });
});

module.exports = router;
