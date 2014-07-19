bout.controller('leaderboard', function($scope, $http, $route) {

  $scope.startOnMoment = moment();
  $route.current.params.type = $route.current.params.type || 'day';

  $scope.getLeaderboard = function() {
    var url = '/api/leaderboards?';
    url += "start_on=" + $scope.startOnMoment.format('YYYYMMDD');
    if ($route.current.params.type === 'day') {
      url += "&days_back=1";
    } else if ($scope.timeBlockType === 'week') {
      url += "&days_back=7";
    }

    $http.get(url).then(function(data) {
      $scope.leaderboard = data.data;
    });
  };

  var chartCanvas = document.getElementById('chart').getContext('2d');
  var chart = new Chart(chartCanvas);
  opts = {
    scaleGridLineColor: '#fff',
    scaleGridLineWidth: 0,
    barShowStroke: false,
    barStrokeWidth: 0
  };

  $scope.$watch('leaderboard', function() {
    var people = [];
    var steps = [];
    _.each($scope.leaderboard, function(person) {
      people.push(person.username);
      steps.push(person.steps);
    });

    var data = {
      labels: people,
      datasets: [{
        label: "Steps",
        data: steps
      }]
    };

    chart.Bar(data, opts);
  });

  $scope.getLeaderboard();

});