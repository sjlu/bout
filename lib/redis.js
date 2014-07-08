var redis = require("redis");
var url = require("url");
var config = require('./config');

var client;
if (config.REDIS_URL) {
  var parts = url.parse(config.REDIS_URL);
  client = redis.createClient(parts.port, parts.hostname);
  client.auth(parts.auth);
} else {
  client = redis.createClient();
}

module.exports = client;
