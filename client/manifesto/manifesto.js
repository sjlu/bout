bout.controller('manifesto', function($scope, $routeParams) {
  $scope.template = $routeParams.page || 'intro';
  console.log($scope.template);
});