bout.controller('overview', function($scope, DataManager) {
  DataManager.observe('stats', function(data) {
    $scope.stats = data;
    console.log($scope.stats);
  });
  DataManager.methods.stats.get();

  DataManager.observe('me', function(data) {
    $scope.user = data;
  });
});