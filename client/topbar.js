bout.directive('topbar', function($location, $rootScope, DataManager) {
  return {
    templateUrl: 'topbar.tmpl',
    link: function($scope, $el) {
      DataManager.observe('me', function(data) {
        $scope.user = data;
      });
    }
  }
});