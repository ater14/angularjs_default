app.factory("UsuariosService", function ($http) {
  const API_URL = "api/usuarios/index.php";
  return {
    get: function () {
      return $http.get(API_URL);
    },
    getById: function (id) {
      return $http.get(API_URL + "?id=" + id);
    },
    insert: function (usuario) {
      return $http.post(API_URL, usuario);
    },
    update: function (usuario) {
      return $http.put(API_URL, usuario);
    },
    delete: function (id) {
      return $http({
        method: "DELETE",
        url: API_URL,
        data: { id: id },
        headers: { "Content-Type": "application/json" },
      });
    },
  };
});
