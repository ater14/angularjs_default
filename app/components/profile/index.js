angular.module("profile", []).component("profile", {
  templateUrl: "app/components/profile/index.html",
  controller: function controller($rootScope, $scope, AuthService) {
    $scope.user = $rootScope.user;

    $scope.update = function () {
      AuthService.updateProfile("ater", 1);
    }
  },
});
