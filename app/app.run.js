(function () {
  "use strict";
  angular.module("aterApp").run([
    "$rootScope",
    "$state",
    "$interval",
    "AuthService",
    function ($rootScope, $state, $interval, AuthService) {
      // Inicialización del usuario
      $rootScope.user = AuthService.getUser();

      // Monitor de cambios en el AuthService (mantiene el Navbar actualizado)
      $rootScope.$watch(
        function () {
          return AuthService.getUser();
        },
        function (newVal) {
          $rootScope.user = newVal;
        },
        true
      );

      $rootScope.$on("$stateChangeStart", function (event, toState) {
        var user = AuthService.getUser();
        if (user.isLogged && !AuthService.isSessionValid()) {
          // toastr.error("Tu sesión ha expirado."); // Opcional
          console.log("Tu sesión ha expirado.");
          AuthService.logout();
        } else {
          AuthService.refreshSession();
        }
        if (toState.authenticate) {
          if (!$rootScope.user.isLogged) {
            event.preventDefault();
            $rootScope.logout();
          } else {
            if (toState.roles.indexOf($rootScope.user.role) == -1) {
              event.preventDefault();
              $rootScope.logout();
            }
          }
        }
        $rootScope.content = toState.content;
      });

      $rootScope.logout = function () {
        AuthService.logout();
        $state.go("home");
      };

      var timer;
      var updateTimerSession = function () {
        if ($rootScope.user && $rootScope.user.isLogged) {
          $rootScope.secondsLeft = AuthService.getSecondsRemaining();

          if ($rootScope.secondsLeft <= 0) {
            $rootScope.logout();
          }
        }
      };
      // Inicia el intervalo
      timer = $interval(updateTimerSession, 1000);
      // Limpieza al destruir el scope
      $rootScope.$on("$destroy", function () {
        if (angular.isDefined(timer)) {
          $interval.cancel(timer);
        }
      });
    },
  ]);
})();
