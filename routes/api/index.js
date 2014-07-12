var express = require('express');
var router = express.Router();
var middlewares = require('../../middlewares');

router.use(middlewares.requiresLogin);

router.use('/me', require('./me'));
router.use('/activity', require('./activity'))

module.exports = router;
