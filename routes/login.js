var express = require('express');
var router = express.Router();
var models = require('../models');
var middlewares = require('../middlewares');
var auth = require('../lib/auth');

router.get('/', middlewares.loggedin, function(req, res) {
  res.render('login');
});

router.post('/', function(req, res, next) {
  auth.authenticate(req.body.username, req.body.password, function(err, uid) {
    if (!uid) {
      req.flash('error', 'Unknown username and password combination.');
      return res.redirect('/login');
    }

    req.session.uid = uid;
    return res.redirect('/');
  });

});

router.post('/token', function(req, res, next) {
  auth.authenticate(req.body.username, req.body.password, function(err, uid) {
    auth.createToken(uid, function(err, token) {
      if (err) return next(err);
      res.send(token);
    });
  });
});

module.exports = router;