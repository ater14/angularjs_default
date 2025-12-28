angular.module("home", []).component("home", {
  templateUrl: "app/components/home/index.html",
  controller: function controller($rootScope, $scope, AuthService) {
    $scope.user = $rootScope.user;

    function randomString(length) {
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }

    $scope.login = function () {
      AuthService.login(randomString(15), true);
    };
  },
});
