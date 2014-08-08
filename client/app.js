bout.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  var routes = {
    '/overview': 'overview',
    '/account': 'account',
    '/devices': 'devices',
    '/friends': 'friends',
    '/leaderboard': 'leaderboard',
    '/foods': 'listFoods'
  };

  for (var route in routes) {
    var controller = routes[route];
    $routeProvider.when(route, {
      templateUrl: controller + '.tmpl',
      controller: controller
    });
  }

  $routeProvider.otherwise({
    redirectTo: '/overview'
  });

}]);