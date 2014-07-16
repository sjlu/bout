var express = require('express');
var router = express.Router();
var models = require('../models');
var middlewares = require('../middlewares');
var auth = require('../lib/auth');

router.get('/', middlewares.redirectIfLoggedIn, function(req, res) {
  res.render('login');
});

router.post('/', function(req, res, next) {
  var username = req.body.username.toLowerCase();

  auth.authenticate(username, req.body.password, function(err, uid) {
    if (!uid) {
      req.flash('error', 'Unknown username and password combination.');
      return res.redirect('/login');
    }

    req.session.uid = uid;
    return res.redirect('/');
  });

});

router.post('/token', function(req, res, next) {
  var username = req.body.username.toLowerCase();

  auth.authenticate(username, req.body.password, function(err, uid) {
    if (err) return next(err);
    if (!uid) {
      res.json({
        "error": "Unknown username and password combination."
      });
    }
    auth.createToken(uid, function(err, token) {
      if (err) return next(err);
      res.json({
        "token":token
      });
    });
  });
});

module.exports = router;