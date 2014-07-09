var express = require('express');
var router = express.Router();
var models = require('../models');
var middlewares = require('../middlewares');

router.get('/', middlewares.loggedin, function(req, res) {
  res.render('login');
});

router.post('/', function(req, res, next) {
  var username = req.body.username;
  models.User.findOne({
    username: username
  }, function(err, user) {
    if (err) return next(err);

    if (!user) {
      req.flash('error', 'Unknown username and password combination.');
      return res.redirect('/login');
    }

    user.authenticate(req.body.password, function(err, match) {
      if (err) return next(err);
      if (!match) {
        req.flash('error', 'Unknown username and password combination.');
        return res.redirect('/login');
      }
      req.session.uid = user._id;
      return res.redirect('/');
    });
  });
});

module.exports = router;