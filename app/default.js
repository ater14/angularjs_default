var app = angular.module("usuarioApp", []);

app.controller("UsuarioController", function (UsuarioService, $timeout) {
  var vm = this;
  vm.usuarios = [];
  vm.usuario = {};
  vm.filtro = "";

  vm.usuario.nombre = 'Ater';
  vm.usuario.email = 'ater@ater.com';
  vm.usuario.edad = 11;

  // 🔹 Ordenamiento inicial
  vm.sortKey = "id";
  vm.reverse = false;

  // 🔹 Config paginación
  vm.pageSize = 50;
  vm.currentPage = 1;

  vm.alerta = { mensaje: "", clase: "" };

  // 🔹 Mostrar alerta temporal
  vm.mostrarAlerta = function (mensaje, tipo) {
    vm.alerta.mensaje = mensaje;
    vm.alerta.clase = tipo === "error" ? "alert-error" : "alert-success";
    $timeout(() => (vm.alerta.mensaje = ""), 30000);
  };

  // 🔹 Cargar todos los usuarios
  vm.obtenerUsuarios = function () {
    UsuarioService.obtener().then(
      (res) => (vm.usuarios = res.data),
      () => vm.mostrarAlerta("Error al cargar usuarios", "error")
    );
  };

  vm.filtroPersonalizado = function (u) {
    if (!vm.filtro) return true;
    const texto = vm.filtro.toLowerCase();
    return u.nombre.toLowerCase().includes(texto) || u.email.toLowerCase().includes(texto);
  };

  // 🔹 Alterna el orden
  vm.ordenarPor = function (campo) {
    if (vm.sortKey === campo) {
      vm.reverse = !vm.reverse;
    } else {
      vm.sortKey = campo;
      vm.reverse = false;
    }
  };

  // 🔹 Guardar / actualizar
  vm.guardarUsuario = function () {
    if (vm.usuario.id) {
      UsuarioService.actualizar(vm.usuario).then(
        () => {
          vm.obtenerUsuarios();
          vm.usuario = {};
          vm.mostrarAlerta("Usuario actualizado correctamente", "success");
        },
        (res) => vm.mostrarAlerta(res.data.message || "Error al actualizar usuario", "error")
      );
    } else {
      UsuarioService.crear(vm.usuario).then(
        () => {
          vm.obtenerUsuarios();
          vm.usuario = {};
          vm.mostrarAlerta("Usuario agregado correctamente", "success");
        },
        (res) => vm.mostrarAlerta(res.data.message || "Error al crear usuario", "error")
      );
    }
  };

  // 🔹 Editar
  vm.editarUsuario = function (u) {
    vm.usuario = angular.copy(u);
  };

  // 🔹 Eliminar
  vm.eliminarUsuario = function (id) {
    if (confirm("¿Seguro de eliminar este usuario?")) {
      UsuarioService.eliminar(id).then(
        () => {
          vm.obtenerUsuarios();
          vm.mostrarAlerta("Usuario eliminado correctamente", "success");
        },
        (res) => vm.mostrarAlerta(res.data.message || "Error al eliminar usuario", "error")
      );
    }
  };

  // 🔹 Cancelar edición
  vm.cancelar = function () {
    vm.usuario = {};
  };

  vm.numPaginas = function () {
    if (!vm.usuariosFiltrados) return 1;
    return Math.ceil(vm.usuariosFiltrados.length / vm.pageSize) || 1;
  };

  vm.nextPage = function () {
    if (vm.currentPage < vm.numPaginas()) vm.currentPage++;
  };

  vm.prevPage = function () {
    if (vm.currentPage > 1) vm.currentPage--;
  };

  // Inicializar
  vm.obtenerUsuarios();
});
