var express = require('express');
var router = express.Router();

router.get('/withings', function(req, res, next) {
  console.log(req);
  console.log(res);
  res.send("OK");
});

module.exports = router;
