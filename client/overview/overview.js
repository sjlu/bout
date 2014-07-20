bout.controller('overview', function($scope, DataManager, $location) {
  DataManager.observe('stats', function(data) {
    $scope.stats = data;
  });
  DataManager.methods.stats.get();

  DataManager.observe('me', function(data) {
    $scope.user = data;
  });

  DataManager.observe('friends', function(data) {
    $scope.friends = data;
  });
  DataManager.methods.friends.get();

  $scope.showLeaderboard = function(type) {
    $location.path('/leaderboard');
    $location.search('type', type);
  };
});