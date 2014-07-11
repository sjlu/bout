bout.controller('overview', function($scope, DataManager) {
  DataManager.observe('activity', function(data) {
    $scope.activity = _.map(data, function(day) {
      day.date = moment(day.date, 'YYYYMMDD').calendar();
      day.date = day.date.replace(/ at.*/, '');
      return day;
    });
  });
});