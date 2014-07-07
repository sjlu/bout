var OAuth = require('oauth');
var config = require('./config');

var oauth = new OAuth.OAuth(
  'https://oauth.withings.com/account/request_token',
  'https://oauth.withings.com/account/access_token',
  config.WITHINGS_API_KEY,
  config.WITHINGS_API_SECRET,
  '1.0',
  null,
  'HMAC-SHA1'
);

module.exports.getRequestAccessUrl = function(cb) {
  oauth.getOAuthRequestToken(function(err, token, secret, results) {
    if (err) return cb(err);
    var url = oauth.signUrl('https://oauth.withings.com/account/authorize', token, secret);
    return cb(null, url);
  });
}