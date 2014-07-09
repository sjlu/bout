var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  req.session.uid = null;
  req.flash('info', 'Successfully logged out.');
  res.redirect('/login');
});

module.exports = router;