var OAuth = require('oauth');
var config = require('./config');
var redis = require('./redis');
var request = require('request');
var URI = require('URIjs');
var _ = require('lodash');

var baseUrl = 'http://api.fitbit.com';
var callbackUrl = config.URL + '/callbacks/fitbit';

var oauth = new OAuth.OAuth(
  'https://api.fitbit.com/oauth/request_token',
  'https://api.fitbit.com/oauth/access_token',
  config.FITBIT_API_KEY,
  config.FITBIT_API_SECRET,
  '1.0',
  config.URL + '/connect/fitbit/callback',
  'HMAC-SHA1'
);

module.exports.getRequestAccessUrl = function(cb) {
  oauth.getOAuthRequestToken(function(err, token, secret, results) {
    if (err) return cb(err);

    // store secret
    redis.set("fitbit_oauth_" + token, secret);

    var authUrl = 'https://api.fitbit.com/oauth/authorize';
    var url = oauth.signUrl(authUrl, token, secret);
    return cb(null, url);
  });
}

module.exports.getRequestToken = function(token, verifier, cb) {
  // get secret
  redis.get("fitbit_oauth_" + token, function(err, secret) {
    if (err) return cb(err);
    oauth.getOAuthAccessToken(token, secret, verifier, function(err, token, secret, results) {
      if (err) return cb(err);
      cb(null, {
        token: token,
        secret: secret
      });
    });
  });
}

var makeRequest = function(url, data, user, cb) {
  data = data || {};
  data.method = data.method || "GET";
  data.params = data.params || {}

  var uri = URI(baseUrl + url);

  data.oauth = {
    consumer_key: config.FITBIT_API_KEY,
    consumer_secret: config.FITBIT_API_SECRET,
    token: user.fitbit_token,
    token_secret: user.fitbit_secret
  };

  _.each(data.params, function(param) {
    uri.addSearch(param[0], param[1]);
  });

  request(uri.toString(), data, function(err, req, body) {
    if (err) return cb(err);
    body = JSON.parse(body);
    cb(null, body);
  });
}

module.exports.getUser = function(user, cb) {
  makeRequest('/1/user/-/profile.json', {}, user, function(err, data) {
    if (err) return cb(err);
    cb(null, data.user);
  });
}

module.exports.subscribe = function(user, cb) {
  makeRequest('/1/user/-/activities/apiSubscriptions/320-activities.json', {
    method: 'POST'
  }, user, cb);
}

module.exports.getSteps = function(date, user, cb) {
  makeRequest('/1/user/-/activities/date/' + date + '.json', {}, user, function(err, data) {
    if (err) return cb(err);
    var steps = 0;
    console.log(data.activities.summary);
    if (data && data.summary && data.summary.steps) {
      steps = data.summary.steps;
    }
    return cb(null, {
      date: date.replace(/-/g, ""),
      steps: steps
    });
  })
}