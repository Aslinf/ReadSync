<?php

include("dataBaseConfig.php");


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");


$eData = file_get_contents("php://input");

//decode json data
$dData = json_decode($eData, true);

// mirar descodificación
if ($dData === null) {
    $response[] = array("result" => "Error decoding JSON data");
    echo json_encode($response);
    exit();
}

$user = $dData['user'];

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