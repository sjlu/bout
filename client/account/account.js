bout.controller('account', function($scope, DataManager) {
  DataManager.observe('me', function(data) {
    $scope.user = data;
  });

  $scope.saveName = function() {
    DataManager.methods.me.update($scope.user);
    $scope.nameChanged = false;
  }
});