var express = require('express');
var router = express.Router();
var middlewares = require('../../middlewares');

router.use(middlewares.requiresLogin);

router.use('/me', require('./me'));
router.use('/activity', require('./activity'));
router.use('/friends', require('./friends'));
router.use('/leaderboards', require('./leaderboards'));
router.use('/users', require('./users'));
router.use('/foods', require('./foods'));

module.exports = router;
