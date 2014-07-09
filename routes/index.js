var express = require('express');
var router = express.Router();
var middlewares = require('../middlewares');

/* GET home page. */
router.get('/', function(req, res) {
  if (req.session.uid) {
    return res.render('client');
  }
  res.render('index');
});

module.exports = router;
