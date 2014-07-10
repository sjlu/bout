var express = require('express');
var router = express.Router();
var middlewares = require('../../middlewares');

router.use(middlewares.session);
router.use(middlewares.user);

router.use('/me', require('./me'));

module.exports = router;