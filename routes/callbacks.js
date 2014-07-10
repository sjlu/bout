var express = require('express');
var router = express.Router();
var kue = require('../lib/kue');
var async = require('async');

router.get('/withings', function(req, res, next) {
  res.send("OK");
});

router.post('/withings', function(req, res, next) {
  var withings_id = req.query.userid;
  var start_date = req.query.startdate;
  var end_date = req.query.enddate;
  var date = req.query.date;

  if (!withings_id) {
    withings_id = req.body.userid;
    start_date = req.body.startdate;
    end_date = req.body.enddate;
    date = req.body.date;
  }

  if (!start_date && !end_date) {
    start_date = date;
    end_date = date;
  }

  console.log("received callback from withings for:", withings_id);

  var query = req.query;
  kue.create('withingsUpdate', {
    withings_id: withings_id,
    start_date: start_date,
    end_date: end_date
  }).save(function(err) {
    if (err) return next(err);
    res.send("OK");
  });
});

router.post('/jawbone', function(req, res, next) {
  var body = req.body;
  async.each(body.events, function(evt, cb) {
    kue.create('jawboneUpdate', {
      jawbone_id: evt.user_xid,
      timestamp: evt.timestamp
    });
  }, function(err) {
    if (err) return next(err);
    res.send("OK");
  });
});

module.exports = router;
