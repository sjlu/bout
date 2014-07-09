var _ = require('lodash');
var URI = require('URIjs');

var config = {
  URL: 'http://bout.ngrok.com/',
  SESSION_SECRET: '=C}J&P)pt82vMVw9yrV<sDsG5/aX-.Cq)2)Ah_p]Yz-4E]3x>u9z*+rM*wjVadsj',
  MONGO_URL: 'mongodb://localhost/bout',
  WITHINGS_API_KEY: 'd9c48779ef509dfdd98d2bf9101d908b57646981f7339617887d7d3d01c6e',
  WITHINGS_API_SECRET: '5891150fb4b4d046e230e680bf262310277cdbd6c69bc26f9e4d922696e2c3',
  JAWBONE_API_KEY: 'TNLgo7mRWY8',
  JAWBONE_API_SECRET: '695198dbcc03e09e1f048720004c9be0de83e82d',
  REDIS_URL: 'redis://localhost:6379'
};

config = _.defaults(process.env, config);

if (config.REDIS_URL) {
  var redisParts = URI(config.REDIS_URL);
  config.REDIS_HOSTNAME = redisParts.hostname();
  config.REDIS_PORT = redisParts.port();
  config.REDIS_PASSWORD = redisParts.password();
}

module.exports = config;
