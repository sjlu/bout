var express = require('express');
var router = express.Router();
var withings = require('../lib/withings');

router.get('/withings', function(req, res, next) {
  withings.getRequestAccessUrl(function(err, url) {
    if (err) return next(err);
    res.redirect(url);
  });
});



module.exports = router;