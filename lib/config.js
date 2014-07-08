var _ = require('lodash');

var config = {
  URL: 'http://localhost:3000',
  SESSION_SECRET: '=C}J&P)pt82vMVw9yrV<sDsG5/aX-.Cq)2)Ah_p]Yz-4E]3x>u9z*+rM*wjVadsj',
  MONGO_URL: 'mongodb://localhost/unity',
  WITHINGS_API_KEY: 'd9c48779ef509dfdd98d2bf9101d908b57646981f7339617887d7d3d01c6e',
  WITHINGS_API_SECRET: '5891150fb4b4d046e230e680bf262310277cdbd6c69bc26f9e4d922696e2c3'
};

config = _.defaults(process.env, config);
module.exports = config;
