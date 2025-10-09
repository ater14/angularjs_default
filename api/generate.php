<?php
$table = isset($_GET['t']) ? $_GET['t'] : die("Error: Debes proporcionar el nombre de la tabla.");

require_once "db.php";
try {

  // Validar nombre de tabla (solo letras, números y guion bajo)
  if (!preg_match('/^[a-zA-Z0-9_]+$/', $table)) {
    die("Error: Nombre de tabla no válido.");
  }

  // Obtener columnas
  $stmt = $pdo->query("SHOW COLUMNS FROM `$table`");
  $db_columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

  if (count($db_columns) == 0) {
    die("Error: No se encontraron columnas en la tabla $table.");
  }

  $select_columns = "";
  $insert_columns = "";
  $insert_params = "";
  $set_columns = "";
  $pk_column = "";
  $bindParam = "";

  $path = __DIR__ . '/' . $table;
  if (!is_dir($path)) {
    mkdir($path, 0777, true);
  }

  foreach ($db_columns as $col) {

    $field = $col['Field'];

    $select_columns .= $field . ",";
    if ($col['Key'] == "PRI") {
      $pk_column = $field;
    }
    if ($col['Key'] != "PRI") {
      $insert_columns .= $field . ",";
      $insert_params .= ":" . $field . ",";
      $set_columns .= $field . "=:" . $field . ",";
      $bindParam .= '$stmt->bindParam(":' . $field . '", $data["' . $field . '"], PDO::PARAM_STR);';
    }
  }

  $select_columns = substr($select_columns, 0, -1);
  $insert_columns = substr($insert_columns, 0, -1);
  $insert_params = substr($insert_params, 0, -1);
  $set_columns = substr($set_columns, 0, -1);
  // return;
  // file_put_contents("columns.txt", $columns);

  $crudCode = <<<PHP
    <?php
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    require_once "../db.php";

    \$method = \$_SERVER['REQUEST_METHOD'];

    switch (\$method) {
        case 'GET':
            \$stmt = \$pdo->query("SELECT $select_columns FROM `$table`");
            echo json_encode(\$stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'POST':
            \$data = json_decode(file_get_contents('php://input'), true);
            try{
                \$stmt = \$pdo->prepare("INSERT INTO `$table` ($insert_columns) VALUES ($insert_params)");
                $bindParam
                \$stmt->execute();
                echo json_encode(["status" => "success", "id" => \$pdo->lastInsertId()]);
            } catch (PDOException \$e) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => \$e->getMessage()]);
            }
            break;

        case 'PUT':
            \$data = json_decode(file_get_contents('php://input'), true);
            try{
                \$stmt = \$pdo->prepare("UPDATE `$table` SET $set_columns WHERE $pk_column = :$pk_column");
                $bindParam
                \$stmt->bindParam(":id", \$data["$pk_column"], PDO::PARAM_INT);
                \$stmt->execute();
                echo json_encode(["status" => "success"]);
            } catch (PDOException \$e) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => \$e->getMessage()]);
            }
            break;
            
        case 'DELETE':
            \$data = json_decode(file_get_contents('php://input'), true);
             try {
                \$stmt = \$pdo->prepare("DELETE FROM `$table` WHERE $pk_column = :$pk_column");
                \$stmt->bindParam(":id", \$data["$pk_column"], PDO::PARAM_INT);
                \$stmt->execute();
                echo json_encode(["status" => "success"]);
            } catch (PDOException \$e) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => \$e->getMessage()]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    }
    ?>
    PHP;

  $serviceCode = 'app.factory("' . ucfirst($table) . 'Service", function ($http) {
    const API_URL = "api/' . $table . '/index.php";
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
    });';

  $controllerCode = '
    var app = angular.module("aterApp", []);
app.controller("Controller", function (' . ucfirst($table) . 'Service, $timeout) {
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
    ' . ucfirst($table) . 'Service.get().then(
      (res) => (vm.items = res.data),
      () => vm.showAlert("Error al cargar items", "error")
    );
  };

  vm.save = function () {
    if (vm.item.id) {
      ' . ucfirst($table) . 'Service.update(vm.item).then(
        () => {
          vm.get();
          vm.item = {};
          vm.showAlert("Información actualizada correctamente", "success");
        },
        (res) => vm.showAlert(res.data.message || "Error al actualizar la información", "error")
      );
    } else {
      ' . ucfirst($table) . 'Service.insert(vm.item).then(
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
      ' . ucfirst($table) . 'Service.delete(id).then(
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
    ';

  file_put_contents($path . "/index.php", $crudCode);
  file_put_contents($table . "Service.js", $serviceCode);
  file_put_contents($table . ".controller.js", $controllerCode);
  http_response_code(200);
  echo json_encode(["status" => "success", "message" => "crud " . strtoupper($table) . " generado exitosamente."]);
} catch (PDOException $e) {
  http_response_code(400);
  echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
