bout.controller('addFood', function($scope, $modalInstance, DataManager) {

  $scope.food = {};

  $scope.create = function() {
    DataManager.methods.foods.create($scope.food, function() {
      $modalInstance.close();
    });

    $scope.food = {};
  }

});