bout.service('DataManager', ['$rootScope', '$http', function($rootScope, $http) {

  var DataManager = (function() {

    // The below
    var cache = {};
    var observers = {};
    var requests = {};

    function DataManager() {
      _.each(window.DataManager, function(preload, set) {
        cache[set] = preload;
      });
    };

    var notify = function(set) {
      if (!observers[set]) return;
      angular.forEach(observers[set], function(cb) {
        cb(cache[set]);
      });
    }

    var update = DataManager.prototype.update = function(set, data) {
      cache[set] = data;
      notify(set);
    };

    var observe = DataManager.prototype.observe = function(set, cb) {
      if (!observers[set]) {
        observers[set] = [];
      }

      observers[set].push(cb);

      if (!cache[set]) {
        if (methods[set] && methods[set].get) {
          methods[set].get();
        }
      }

      if (!cache[set]) {
        if (methods[set] && methods[set].defaults) {
          cache[set] = methods[set].defaults;
        } else {
          cache[set] = {};
        }
      }
      cb(cache[set]);
    }

    var request = DataManager.prototype.request = function(method, url, data, cb) {
      data = data || {}
      cb = cb || function() {};

      // only allow one GET request at a time.
      if (method === "GET") {
        if (requests[url]) {
          return cb();
        }

        requests[url] = true;
      }

      $http({
        method: method,
        url: url,
        data: data
      }).success(function(data) {
        cb(null, data);

        if (method === 'GET') {
          delete requests[url];
        }
      }).error(function(data, status, headers, config) {
        // for some reason if the user runs into a
        // 401 we want to redirect them back to the
        // login
        if (status === 401) {
          window.location = '/login'
        }
        console.error("[DataManager]", "Request failed for " + method, url + ".", "Got", status, data + ".");
        cb(data);
      });
    };

    var methods = DataManager.prototype.methods = {

      me: {
        get: function() {
          request("GET", "/api/me", {}, function(err, data) {
            update('me', data);
          });
        },
        update: function(user) {
          request("PUT", "/api/me", user, function(err, data) {
            update('me', data);
          });
        }
      },
      activity: {
        get: function() {
          request("GET", "/api/activity", {}, function(err, data) {
            update('activity', data);
          });
        }
      },
      friends: {
        get: function() {
          request("GET", "/api/friends", {}, function(err, data) {
            update('friends', data);
          });
        }
      },
      pending_friends: {
        get: function() {
          request("GET", "/api/friends/pending", {}, function(err, data) {
            update('pending_friends', data);
          });
        }
      },
      stats: {
        get: function() {
          request("GET", "/api/me/stats?start_on=" + moment().format('YYYYMMDD'), {}, function(err, data) {
            update('stats', data);
          });
        }
      },
      foods: {
        get: function() {
          request("GET", "/api/foods", {}, function(err, data) {
            update("foods", data);
          });
        },
        create: function(food, cb) {
          request("POST", "/api/foods", food, function(err) {
            if ("function" === typeof cb) {
              cb();
            }
            methods.foods.get();
          });
        }
      },
      food_entries: {
        get: function() {

        },
        create: function(entry, cb) {
          request("POST", "/api/me/food/entries", entry, function(err) {
            if ("function" === typeof cb) {
              cb();
            }
            methods.food_entries.get();
          })
        }
      }

    };

    return DataManager;

  })();

  return new DataManager();

}]);