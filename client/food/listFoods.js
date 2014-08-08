bout.controller('listFoods', function($scope, DataManager, $modal) {

  DataManager.observe('foods', function(data) {
    $scope.foods = data;
  });

  $scope.openAddFoodModal = function() {
    $modal.open({
      templateUrl: 'addFood.tmpl',
      controller: 'addFood'
    });
  }

});