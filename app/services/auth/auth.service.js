(function () {
  "use strict";
  angular.module("aterApp").factory("AuthService", function () {
    const storageKey = "userWinix";
    // const EXPIRE_TIME = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
    const EXPIRE_TIME = 1 * 60 * 1000; // 1 minuto (60,000 milisegundos)

    var savedUser = localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);
    var user = savedUser ? JSON.parse(savedUser) : { isLogged: false };

    var service = {
      login: function (name, persistir) {
        user.name = name || "Usuario Demo";
        user.isLogged = true;
        user.role = 2; // Rol de demo
        user.loginTimestamp = new Date().getTime();
        this.saveToStorage(persistir);
      },

      isSessionValid: function () {
        if (!user.isLogged || !user.loginTimestamp) return false;
        var now = new Date().getTime();
        if (now - user.loginTimestamp > EXPIRE_TIME) {
          this.logout();
          return false;
        }
        return true;
      },

      refreshSession: function () {
        if (user.isLogged) {
          user.loginTimestamp = new Date().getTime();
          this.saveToStorage(localStorage.getItem(storageKey) !== null);
        }
      },

      getSecondsRemaining: function () {
        if (!user.isLogged || !user.loginTimestamp) return 0;
        var now = new Date().getTime();
        var elapsed = now - user.loginTimestamp;
        var remaining = EXPIRE_TIME - elapsed;
        return remaining > 0 ? Math.floor(remaining / 1000) : 0;
      },

      updateProfile: function (name, role) {
        console.log(role);
        user.name = name + " (Updated)";
        user.role = role;
        this.saveToStorage(true);
      },

      logout: function () {
        user.name = undefined;
        user.isLogged = false;
        user.loginTimestamp = undefined;
        localStorage.removeItem(storageKey);
        sessionStorage.removeItem(storageKey);
      },

      saveToStorage: function (persistir) {
        var data = JSON.stringify(user);
        persistir ? localStorage.setItem(storageKey, data) : sessionStorage.setItem(storageKey, data);
      },

      getUser: function () {
        return user;
      },
    };

    return service;
  });
})();
