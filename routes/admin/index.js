var express = require('express');
var router = express.Router();
var middlewares = require('../../middlewares');

router.use(middlewares.requiresLogin);
router.use(middlewares.requiresAdmin);

router.use('/email', require('./email'));

module.exports = router;
