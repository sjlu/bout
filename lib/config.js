var _ = require('lodash');

var config = {
  SESSION_SECRET: '=C}J&P)pt82vMVw9yrV<sDsG5/aX-.Cq)2)Ah_p]Yz-4E]3x>u9z*+rM*wjVadsj'
};

config = _.defaults(process.env, config);
module.exports = config;
