var express = require('express');
var router = express.Router();
var withings = require('../lib/withings');
var middlewares = require('../middlewares');
var jawbone = require('../lib/jawbone');
var kue = require('../lib/kue');

router.use(middlewares.session);
router.use(middlewares.user);

router.get('/', function(req, res, next) {
  res.render('connect');
});

router.get('/withings', function(req, res, next) {
  withings.getRequestAccessUrl(function(err, url) {
    if (err) return next(err);
    res.redirect(url);
  });
});

router.get('/withings/callback', function(req, res, next) {
  var token = req.query.oauth_token;
  var userid = req.query.userid;
  withings.getRequestToken(token, function(err, creds) {
    if (err) return next(err);

    req.user.withings_id = userid;
    req.user.withings_token = creds.token;
    req.user.withings_secret = creds.secret

    req.user.save(function(err) {
      if (err) return next(err);

      kue.create('processWithingsConnection', {
        uid: req.user.id
      }).save(function(err) {
        if (err) return next(err);
        res.redirect('/connect');
      });

    });
  });
});

router.get('/jawbone', function(req, res, next) {
  jawbone.getRequestAccessUrl(function(err, url) {
    if (err) return next(err);
    res.redirect(url);
  });
});

router.get('/jawbone/callback', function(req, res, next) {
  var code = req.query.code;
  jawbone.getRequestToken(code, function(err, token) {
    if (err) return next(err);

    req.user.jawbone_token = token;

    req.user.save(function(err) {
      if (err) return next(err);
      res.redirect('/connect');
    });
  });
});

module.exports = router;