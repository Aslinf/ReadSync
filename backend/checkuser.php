<?php

include("dataBaseConfig.php");


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

$user = $_GET['user'];
if ($user === "") {
    $response[] = array("result" => "Falta información de usuario");
    echo json_encode($response);
    exit();
}

$result = "";

if($user !== ""){

    $sql = "SELECT usuario FROM USUARIOS WHERE usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $stmt->bind_result($resultMsg);
    $stmt->fetch();
    

    if($resultMsg !== null){
        $result = "¡Ese nombre de usuario ya está registrado!";
    } else {
        $result = "";
    }

    $stmt->close();
} else {
    $result = "";
}

$conn -> close();
$response[] = array("result" => $result);
echo json_encode($response);

?>