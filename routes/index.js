var express = require('express');
var router = express.Router();
var middlewares = require('../middlewares');

/* GET home page. */
router.get('/', middlewares.loggedin, function(req, res) {
  if (req.session.uid) {
    return res.redirect('/dashboard');
  }
  res.render('index');
});

module.exports = router;
