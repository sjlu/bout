bout.controller('friends', function($scope, DataManager, $http) {

  $http.get('/api/leaderboards?days_back=7').then(function(data) {
    $scope.leaderboard = data.data;
  });

  DataManager.observe('pending_friends', function(data) {
    $scope.pending_friends = data;
  });
  DataManager.methods.pending_friends.get();

  $scope.searchUsers = function($value) {
    return $http.get('/api/users/search?query=' + $value).then(function(data) {
      return data.data;
    });
  }

  $scope.typeaheadSelected = function($item, $model, $label) {
    $http.post('/api/friends', {
      uid: $item._id
    }).then(function() {
      DataManager.methods.pending_friends.get();
    });
    $scope.addFriend = null;
  }

  $scope.acceptFriendRequest = function(user) {
    $http.post('/api/friends/' + user.pid + '/accept').then(function() {
      DataManager.methods.pending_friends.get();
      DataManager.methods.friends.get();
    });
  }

});