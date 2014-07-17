var express = require('express');
var router = express.Router();
var leaderboards = require('../../lib/leaderboards');

router.get('/', function(req, res, next) {
  leaderboards(req.user, req.query, function(err, data) {
    if (err) return next(err);
    return res.json(data);
  });
});

module.exports = router;