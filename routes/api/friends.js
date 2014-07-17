var express = require('express');
var router = express.Router();
var models = require('../../models');
var friends = require('../../lib/friends');
var async = require('async');
var email = require('../../lib/email');

router.get('/', function(req, res, next) {
  friends.friendsForUser(req.user, function(err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

router.get('/pending', function(req, res, next) {
  friends.pendingForUser(req.user, function(err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

router.post('/', function(req, res, next) {
  if (!req.body.uid) {
    return next(new Error('Expected a user id to make a friend of.'));
  }

  models.Pair.createPair(req.user, req.body.uid, function(err, pair) {
    if (err) return next(err);
    email.create('friendRequest', {pid:pair._id}, function(err) {
      if (err) return next(err);
      res.json(pair);
    });
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