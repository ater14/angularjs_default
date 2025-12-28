(function () {
  "use strict";
  angular.module("aterApp").filter("secondsToDateTime", function () {
    return function (seconds) {
      // Crea un objeto fecha basado en los segundos para formatearlo fácilmente
      return new Date(1970, 0, 1).setSeconds(seconds);
    };
  });
})();