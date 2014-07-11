bout.controller('account', function($scope, DataManager) {
  DataManager.observe('me', function(data) {
    $scope.user = data;
  });
});