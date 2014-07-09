var express = require('express');
var router = express.Router();
var models = require('../models');
var validator = require('validator');
var middlewares = require('../middlewares');

/* GET home page. */
router.get('/', middlewares.loggedin, function(req, res) {
  res.render('register');
});

router.post('/', function(req, res, next) {
  var email = req.body.email;
  if (!validator.isEmail(email)) {
    req.flash('error', 'Not a valid email address.');
    return res.redirect('/register');
  };

  var username = req.body.username;
  if (!username.length) {
    req.flash('error', 'A valid username is required.');
    return res.redirect('/register');
  }

  var password = req.body.password;
  if (password.length < 7) {
    req.flash('error', 'Password must be longer than 7 characters.');
    return res.redirect('/register');
  }

  if (!validator.equals(req.body.password, req.body.confirm_password)) {
    req.flash('error', 'Passwords are not the same.');
    return res.redirect('/register');
  }

  var user = new models.User({
    email: email,
    username: username,
    password: password
  });

  user.save(function(err) {
    if (err) return next(err);
    req.flash('info', 'Account created, please login.');
    res.redirect('/login');
  });
});

module.exports = router;