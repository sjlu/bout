var OAuth = require('oauth');
var config = require('./config');
var uid = require('uid');
var URI = require('URIjs');
var _ = require('lodash');
var request = require('request');

var baseUrl = 'https://jawbone.com/nudge/api/v.1.1';

var oauth = new OAuth.OAuth2(
  config.JAWBONE_API_KEY,
  config.JAWBONE_API_SECRET,
  'https://jawbone.com/',
  'auth/oauth2/auth',
  'auth/oauth2/token',
  null
);

module.exports.getRequestAccessUrl = function(cb) {
  var authUrl = oauth.getAuthorizeUrl({
    redirect_uri: config.URL + '/connect/jawbone/callback',
    scope: 'basic_read, move_read',
    state: uid(32),
    response_type: 'code'
  });

  cb(null, authUrl);
}

module.exports.getRequestToken = function(code, cb) {
  oauth.getOAuthAccessToken(
    code,
    {"grant_type": "authorization_code"},
    function(err, access_token, refresh_token, results) {
      if (err) return cb(err);
      return cb(null, access_token);
    }
  )
};

var makeRequest = function(url, data, user, cb) {
  data = data || {};
  data.method = data.method || "GET";
  data.params = data.params || {};
  data.headers = data.headers || {}
  data.headers.Authorization = "Bearer " + user.jawbone_token;

  var uri = URI(baseUrl + url);

  _.each(data.params, function(value, key) {
    uri.addSearch(key, value);
  });

  request(uri.toString(), data, function(err, req, body) {
    if (err) return cb(err);
    body = JSON.parse(body);
    cb(null, body.data);
  })
}

module.exports.getUser = function(user, cb) {
  makeRequest('/users/@me', {}, user, function(err, data) {
    if (err) return cb(err);
    cb(null, data);
  });
};

module.exports.getSteps = function(start, end, user, cb) {
  makeRequest('/users/@me/moves', {
    params: {
      start_time: start,
      end_time: end
    }
  }, user, function(err, data) {
    if (err) return cb(err);

    data = _.map(data.items, function(day) {
      return {
        date: day.date,
        steps: day.details.steps
      };
    });

    cb(null, data);
  });
}