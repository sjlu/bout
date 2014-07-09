var express = require('express');
var router = express.Router();
var middlewares = require('../middlewares');

router.use(middlewares.session);
router.use(middlewares.user);

router.get('/', function(req, res, next) {
  res.render('dashboard');
});

module.exports = router;