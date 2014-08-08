bout.controller('listFoods', function($scope, DataManager) {

  DataManager.observe('foods', function(data) {
    $scope.foods = data;
  });

});