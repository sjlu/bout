var OAuth = require('oauth');
var config = require('./config');
var uid = require('uid');

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