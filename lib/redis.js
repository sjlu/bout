var redis = require("redis");
var config = require('./config');

var client;
if (config.REDIS_URL) {
  client = redis.createClient(config.REDIS_PORT, config.REDIS_HOSTNAME, {
    auth_pass: config.REDIS_PASSWORD
  });
} else {
  client = redis.createClient();
}

module.exports = client;
