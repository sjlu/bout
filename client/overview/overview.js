bout.controller('overview', function($scope, DataManager) {
  DataManager.observe('activity', function(data) {
    $scope.activity = _.map(data, function(day) {
      day.displayDate = moment(day.date, 'YYYYMMDD').calendar();
      day.displayDate = day.displayDate.replace(/ at.*/, '');
      return day;
    });
  });
});