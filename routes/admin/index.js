var express = require('express');
var router = express.Router();
var middlewares = require('../../middlewares');
var config = require('../../lib/config');

router.use(middlewares.requiresLogin);
router.use(middlewares.requiresAdmin);

router.use('/email', require('./email'));
router.use('/version', function(req, res, next) {
  res.json({
    version: config.GITREV
  });
});

module.exports = router;

