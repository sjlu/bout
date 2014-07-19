bout.controller('overview', function($scope, DataManager, $location) {
  DataManager.observe('stats', function(data) {
    $scope.stats = data;
  });
  DataManager.methods.stats.get();

  DataManager.observe('me', function(data) {
    $scope.user = data;
  });

  $scope.showLeaderboard = function(type) {
    $location.path('/leaderboard');
    $location.search('type', type);
  };
});