var express = require('express');
var router = express.Router();
var middlewares = require('../middlewares');
var models = require('../models');
var validator = require('validator');

var renderClient = function(req, res, next) {
  return res.render('client');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.uid) {
    return renderClient(req, res, next);
  }

  return res.render('index');
});

router.post('/', function(req, res, next) {
  var email = req.body.email;
  if (!validator.isEmail(email)) {
    req.flash('error', 'Not a valid email address,');
    return res.redirect('/');
  }

  var invite = new models.Invite({
    email: email
  });

  invite.save(function(err) {
    if (err) return next(err);
    req.flash('info', 'We added you to the invite list!');
    res.redirect('/');
  });
});

module.exports = router;
