var express = require('express');
var router = express.Router();
var models = require('../../models');

router.get('/', function(req, res, next) {
  models.Food.getFoodsForUser(req.user, function(err, foods) {
    if (err) return next(err);
    res.json(foods);
  });
});

router.post('/', function(req, res, next) {
  models.Food.createFoodForUser(req.user, req.body, function(err, food) {
    if (err) return next(err);
    res.json(food);
  });
});

module.exports = router;