<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../db.php";

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT id,nombre,email,edad FROM `usuarios`");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $stmt = $pdo->prepare("INSERT INTO `usuarios` (nombre,email,edad) VALUES (:nombre,:email,:edad)");
            $stmt->bindParam(":nombre", $data["nombre"], PDO::PARAM_STR);
            $stmt->bindParam(":email", $data["email"], PDO::PARAM_STR);
            $stmt->bindParam(":edad", $data["edad"], PDO::PARAM_STR);
            $stmt->execute();
            echo json_encode(["status" => "success", "id" => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $stmt = $pdo->prepare("UPDATE `usuarios` SET nombre=:nombre,email=:email,edad=:edad WHERE id = :id");
            $stmt->bindParam(":nombre", $data["nombre"], PDO::PARAM_STR);
            $stmt->bindParam(":email", $data["email"], PDO::PARAM_STR);
            $stmt->bindParam(":edad", $data["edad"], PDO::PARAM_STR);
            $stmt->bindParam(":id", $data["id"], PDO::PARAM_INT);
            $stmt->execute();
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $stmt = $pdo->prepare("DELETE FROM `usuarios` WHERE id = :id");
            $stmt->bindParam(":id", $data["id"], PDO::PARAM_INT);
            $stmt->execute();
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Método no permitido"]);
}
