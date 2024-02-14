<?php

include("dataBaseConfig.php");


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


$eData = file_get_contents("php://input");


$dData = json_decode($eData, true);

// mirar descodificación
if ($dData === null) {
    $response[] = array("result" => "Error decoding JSON data");
    echo json_encode($response);
    exit();
}

$user = $dData['user'];
$email = $dData['email'];
$password = $dData['password'];

$result = "";

if($user !== "" and $email !== "" and $password !== ""){
    // Hash contraseña
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO USUARIOS (usuario, email, password) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $user, $email, $hashedPassword);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        $result = "Registro completado";
    } else {
        $result = "Error en la inserción";
    }

    $stmt->close();
} else {
    $result = "Campos vacíos";
}

$conn -> close();
$response[] = array("result" => $result);
echo json_encode($response);

