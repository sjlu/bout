bout.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  var routes = {
    '/': 'overview',
    '/account': 'account',
  };

  for (var route in routes) {
    var controller = routes[route];
    $routeProvider.when('/app' + route, {
      templateUrl: controller + '.tmpl',
      controller: controller
    });
  }

  $routeProvider.otherwise({
    redirectTo: '/app'
  });

}]);