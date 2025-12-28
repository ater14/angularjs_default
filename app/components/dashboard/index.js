angular.module("dashboard", []).component("dashboard", {
  templateUrl: "app/components/dashboard/index.html",
  controller: function controller($rootScope, $scope) {
    $scope.user = $rootScope.user;
  },
});
