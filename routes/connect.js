var express = require('express');
var router = express.Router();
var withings = require('../lib/withings');
var middlewares = require('../middlewares');

router.use(middlewares.session);
router.use(middlewares.user);

router.get('/withings', function(req, res, next) {
  withings.getRequestAccessUrl(function(err, url) {
    if (err) return next(err);
    res.redirect(url);
  });
});

router.get('/withings/callback', function(req, res, next) {
  var token = req.query.oauth_token;
  var userid = req.query.userid;
  withings.getRequestToken(token, function(err, token, secret) {
    if (err) return next(err);
    req.user.withings = {
      id: userid,
      token: token,
      secret: secret
    }
    req.user.save(function(err) {
      if (err) return next(err);
      res.send("OK");
    })
  });
});

module.exports = router;