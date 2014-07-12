var express = require('express');
var router = express.Router();
var models = require('../../models');
var friends = require('../../lib/friends')
var async = require('async');

router.get('/', function(req, res, next) {
  friends.friendsForUser(req.user, function(err, users) {
    res.json(users);
  });
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  if (!req.body.uid) {
    return next(new Error('Expected a user id to make a friend of.'));
  }

  models.Pair({
    uid1: req.user._id,
    uid2: req.body.uid
  }).save(function(err, pair) {
    res.json(pair);
  });
});

router.post('/:pid/accept', function(req, res, next) {
  models.Pair.findById(req.params.pid, function(err, pair) {
    if (err) return next(err);

    if (pair.uid2 != req.user._id) {
      res.send(403);
    }

    pair.pending = false;
    pair.save(function(err, pair) {
      if (err) return next(err);
      res.json(pair);
    });
  })
});

module.exports = router;