<?php

include("dataBaseConfig.php");
require '../vendor/autoload.php'; 

use \Firebase\JWT\JWT;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");


$eData = file_get_contents("php://input");

file_put_contents('php://stderr', print_r($eData, true));


$dData = json_decode($eData, true);

// mirar descodificación
if ($dData === null) {
    $response[] = array("result" => "Error decoding JSON data");
    echo json_encode($response);
    exit();
}

$user = trim($dData['user']);
$password = trim($dData['password']);

$result = "";

if($user !== "" and $password !== ""){

    $sql = "SELECT usuario, password FROM USUARIOS WHERE usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $stmt->bind_result($storedUser, $hashedPassword);
    $stmt->fetch();
    $stmt->close();

    if (password_verify($password, $hashedPassword)) {
        // Se crea una sesión una vez las credenciales son corerctas
        session_start();
        $_SESSION['username'] = $storedUser;

        $secretKey = bin2hex(random_bytes(32));
        $token = JWT::encode(['user' => $storedUser], $secretKey, 'HS256');

         // Generate JWT token
        //$jwtPayload = array("user" => $storedUser);
        //$jwt = jwt_encode($jwtPayload, $secretKey); // Use a secure secret key
        // Contraseña correcta
        $result = "Inicio de sesión exitoso";
        $response[] = array("result" => $result, "user" => $storedUser, "token" => $token);
    } else {
        // Credenciales inválidas
        $result = "Credenciales inválidas";
        $response[] = array("result" => $result);
    }
} else {
    $result = "Campos vacíos";
}

$conn -> close();
$response[] = array("result" => $result, "user" => isset($_SESSION['user']) ? $_SESSION['user'] : null);
echo json_encode($response);

