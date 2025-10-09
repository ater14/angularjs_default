var app = angular.module("aterApp", []);
app.controller("Controller", function (UsuariosService, $timeout) {
  var vm = this;
  vm.items = [];
  vm.item = {};

  vm.alert = { msj: "", clase: "" };

  vm.showAlert = function (msj, tipo) {
    vm.alert.msj = msj;
    vm.alert.class = tipo === "error" ? "alert-error" : "alert-success";
    $timeout(() => (vm.alert.msj = ""), 30000);
  };

  vm.get = function () {
    UsuariosService.getRows().then(
      (res) => (vm.items = res.data),
      () => vm.showAlert("Error al cargar items", "error")
    );
  };

  vm.save = function () {
    if (vm.item.id) {
      UsuariosService.update(vm.item).then(
        () => {
          vm.get();
          vm.item = {};
          vm.showAlert("Información actualizada correctamente", "success");
        },
        (res) => vm.showAlert(res.data.message || "Error al actualizar la información", "error")
      );
    } else {
      UsuariosService.insert(vm.item).then(
        () => {
          vm.get();
          vm.item = {};
          vm.showAlert("Información creada correctamente", "success");
        },
        (res) => vm.showAlert(res.data.message || "Error al crear la información", "error")
      );
    }
  };

  vm.selectItem = function (u) {
    vm.item = angular.copy(u);
  };

  vm.delete = function (id) {
    if (confirm("¿Seguro de eliminar la información?")) {
      UsuariosService.delete(id).then(
        () => {
          vm.get();
          vm.showAlert("Información eliminada correctamente", "success");
        },
        (res) => vm.showAlert(res.data.message || "Error al eliminar la información", "error")
      );
    }
  };

  vm.cancel = function () {
    vm.item = {};
  };

  vm.get();
});
