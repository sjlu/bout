var OAuth = require('oauth');
var config = require('./config');
var redis = require('./redis');

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