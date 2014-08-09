var _ = require('lodash');
var URI = require('URIjs');

var config = {
  // DOMAIN: 'bout.ngrok.com',
  DOMAIN: 'localhost:3000',
  SESSION_SECRET: '=C}J&P)pt82vMVw9yrV<sDsG5/aX-.Cq)2)Ah_p]Yz-4E]3x>u9z*+rM*wjVadsj',
  MONGO_URL: 'mongodb://localhost/bout',
  WITHINGS_API_KEY: 'd9c48779ef509dfdd98d2bf9101d908b57646981f7339617887d7d3d01c6e',
  WITHINGS_API_SECRET: '5891150fb4b4d046e230e680bf262310277cdbd6c69bc26f9e4d922696e2c3',
  JAWBONE_API_KEY: 'TNLgo7mRWY8',
  JAWBONE_API_SECRET: '695198dbcc03e09e1f048720004c9be0de83e82d',
  REDIS_URL: 'redis://localhost:6379',
  MANDRILL_API_KEY: 'baNNPMy61JAouM0yw0t0hQ',
  MANDRILL_DOMAIN: 'bout.herokuapp.com',
  ENV: 'development',
  FITBIT_API_KEY: '10330424055b4487b8f5cf6a8def6587',
  FITBIT_API_SECRET: '14a6485b178545399888e9b4c48437d5',
  SLACK_TOKEN: 'QFifuQHYryRsobZtVixJqJUD',
  SLACK_DOMAIN: 'shapedhealth',
  SLACK_USERNAME: 'boutbot',
  SLACK_CHANNEL: '#info',
  AWS_KEY: 'AKIAJFG22ST2QUZ2PYZQ',
  AWS_SECRET: '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',
  AWS_CDN_BUCKET: 'bout',
  AWS_CF_URL: 'https://d3rh8z2fctbze4.cloudfront.net/'
};

config = _.defaults(process.env, config);

if (config.REDIS_URL) {
  var redisParts = URI(config.REDIS_URL);
  config.REDIS_HOSTNAME = redisParts.hostname();
  config.REDIS_PORT = redisParts.port();
  config.REDIS_PASSWORD = redisParts.password();
}

var urlPrefix = 'https://';
if (config.DOMAIN.indexOf('localhost') > -1 || config.DOMAIN.indexOf('ngrok.com') > -1) {
  urlPrefix = 'http://';
}
config.URL = urlPrefix + config.DOMAIN;

module.exports = config;
