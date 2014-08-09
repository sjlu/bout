bout.controller('steps', function($scope, DataManager, $location, $http) {
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

  $http.get('/api/me/track?start_on=' + moment().format('YYYYMMDD')).then(function(data) {
    $scope.track = data.data;
    $scope.on_track = data.data.on_track > 0;
  });

  var chartCanvas = document.getElementById('chart').getContext('2d');
  var chart = new Chart(chartCanvas);
  opts = {};

  $scope.$watch('track', function() {
    if (!$scope.track) return;
    var data = {
      labels: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      datasets: [{
        label: "This Week",
        fillColor: "rgba(49,53,64,0.4)",
        strokeColor: "rgba(49,53,64,1)",
        pointColor: "rgba(49,53,64,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "#313540",
        data: _.pluck($scope.track.this_week, 'total')
      }, {
        label: "Last Week",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: _.pluck($scope.track.last_week, 'total')
      }]
    };

    chart.Line(data, opts);
  });

  $scope.showLeaderboard = function(type) {
    $location.path('/steps/leaderboard');
    $location.search('type', type);
  };
});