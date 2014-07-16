var email = require('../../lib/email');
var express = require('express');
var router = express.Router();

router.get('/:template', function(req, res, next) {
  email.preview(req.params.template, {}, function(err, html) {
    res.send(html);
  });
});

module.exports = router;