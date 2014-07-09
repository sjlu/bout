var redis = require("redis");
var url = require("url");
var config = require('./config');

var client;
if (config.REDIS_URL.length) {
  var parts = url.parse(config.REDIS_URL);
  var password = parts.auth.split(":");
  password = password[1];
  client = redis.createClient(parts.port, parts.hostname, {
    auth_pass: password
  });
} else {
  client = redis.createClient();
}

module.exports = client;
