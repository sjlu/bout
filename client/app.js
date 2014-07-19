bout.config(['$routeProvider', function($routeProvider, $locationProvider) {

  var routes = {
    '/': 'overview',
    '/account': 'account',
    '/connect': 'connect',
    '/friends': 'friends',
    '/leaderboard': 'leaderboard'
  };

  for (var route in routes) {
    var controller = routes[route];
    $routeProvider.when(route, {
      templateUrl: controller + '.tmpl',
      controller: controller
    });
  }

  $routeProvider.otherwise({
    redirectTo: '/'
  });

}]);