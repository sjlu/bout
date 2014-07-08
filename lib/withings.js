var OAuth = require('oauth');
var config = require('./config');
var redis = require('./redis');
var request = require('request');
var URI = require('URIjs');
var _ = require('lodash');

var withingsBaseUrl = 'http://wbsapi.withings.net';
var withingsCallbackUrl = config.URL + '/callbacks/withings';

var oauth = new OAuth.OAuth(
  'https://oauth.withings.com/account/request_token',
  'https://oauth.withings.com/account/access_token',
  config.WITHINGS_API_KEY,
  config.WITHINGS_API_SECRET,
  '1.0',
  config.URL + '/connect/withings/callback',
  'HMAC-SHA1'
);

module.exports.getRequestAccessUrl = function(cb) {
  oauth.getOAuthRequestToken(function(err, token, secret, results) {
    if (err) return cb(err);

    // store secret
    redis.set("withings_oauth_" + token, secret);

    var authUrl = 'https://oauth.withings.com/account/authorize';
    var url = oauth.signUrl(authUrl, token, secret);
    return cb(null, url);
  });
}

module.exports.getRequestToken = function(token, cb) {
  // get secret
  redis.get("withings_oauth_" + token, function(err, secret) {
    if (err) return cb(err);
    oauth.getOAuthAccessToken(token, secret, function(err, token, secret, results) {
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
  data.params.userid = user.withings_id;

  var uri = URI(withingsBaseUrl + url);

  var params = oauth._prepareParameters(
    user.withings_token,
    user.withings_secret,
    data.method,
    uri.toString(),
    data.params
  );

  _.each(params, function(param) {
    uri.addSearch(param[0], param[1]);
  });

  request(uri.toString(), data, function(err, req, body) {
    if (err) return cb(err);
    body = JSON.parse(body);
    cb(null, body);
  });
}

module.exports.subscribe = function(user, cb) {
  makeRequest("/notify", {
    params: {
      action: "subscribe",
      appli: 16,
      callbackurl: withingsCallbackUrl,
      comment: "steps"
    }
  }, user, function(err, data) {
    if (err) return cb(err);
    cb();
  });
}

module.exports.getSteps = function(user, date, cb) {
  makeRequest('/v2/measure', {
    params: {
      action: "getactivity",
      date: date
    }
  }, user, function(err, data) {
    if (err) return cb(err);
    cb(null, data.body);
  });
}
