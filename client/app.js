bout.config(['$routeProvider', function($routeProvider, $locationProvider) {

  var routes = {
    '/': 'index'
  };

  for (var route in routes) {
    var controller = routes[route];
    $routeProvider.when(route, {
      templateUrl: controller + '.html',
      controller: controller
    });
  }

  $routeProvider.otherwise({
    redirectTo: '/'
  });

}]);