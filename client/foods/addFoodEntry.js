bout.controller('addFoodEntry', function($scope, $modalInstance, food, DataManager) {

  $scope.food = food;

  $scope.entry = {
    _fid: food.id,
    serving_size: food.serving_size,
    serving_type: food.serving_type,
    eaten_at_date: moment().format('MM/DD/YYYY')
  }

  $scope.create = function() {
    var entry = _.clone($scope.entry);

    // fix up the date
    var date = moment(entry.eaten_at_date);
    entry.eaten_at_date = date.format('YYYYMMDD');

    // set a default time
    var time = moment(entry.eaten_at_time);
    entry.eaten_at_time = time.format('HHmm');

    DataManager.methods.food_entries.create(entry, function() {
      $modalInstance.close();
    });
  }

});