(function () {
  "use strict";
  angular.module("aterApp").config([
    "$locationProvider",
    "$stateProvider",
    "$urlRouterProvider",
    "$ocLazyLoadProvider",
    function ($locationProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
      var APP_VERSION = "202512060605";
      $locationProvider.hashPrefix("");
      $locationProvider.html5Mode(true);
      $urlRouterProvider.when("", "/home");
      $urlRouterProvider.when("/", "/home");
      $urlRouterProvider.otherwise("/404");
      $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        serie: true,
        modules: [
          {
            name: "home",
            files: ["app/components/home/index.js?v=" + APP_VERSION],
          },
          {
            name: "dashboard",
            files: ["app/components/dashboard/index.js?v=" + APP_VERSION],
          },
          {
            name: "profile",
            files: ["app/components/profile/index.js?v=" + APP_VERSION],
          },
        ],
      });
      $stateProvider
        .state("home", {
          url: "/home",
          content: true,
          authenticate: false,
          templateUrl: "app/views/home/index.html?v=" + APP_VERSION,
          resolve: {
            loadMyCtrl: function ($ocLazyLoad) {
              return $ocLazyLoad.load("home");
            },
          },
        })
        .state("404", {
          url: "/404",
          content: false,
          authenticate: false,
          templateUrl: "app/views/404.html?v=" + APP_VERSION,
        })
        .state("dashboard", {
          url: "/dashboard",
          content: true,
          authenticate: true,
          roles: [2],
          templateUrl: "app/views/dashboard/index.html?v=" + APP_VERSION,
          resolve: {
            loadMyCtrl: function ($ocLazyLoad) {
              return $ocLazyLoad.load("dashboard");
            },
          },
        })
        .state("profile", {
          url: "/profile",
          content: true,
          authenticate: true,
          roles: [1, 2],
          templateUrl: "app/views/profile/index.html?v=" + APP_VERSION,
          resolve: {
            loadMyCtrl: function ($ocLazyLoad) {
              return $ocLazyLoad.load("profile");
            },
          },
        });
    },
  ]);
})();
