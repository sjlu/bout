bout.controller('connect', function($scope, DataManager) {
  DataManager.observe('me', function(data) {
    $scope.user = data;
  });
});