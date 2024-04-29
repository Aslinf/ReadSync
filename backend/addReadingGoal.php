<?php

include("dataBaseConfig.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$eData = file_get_contents("php://input");
$dData = json_decode($eData, true);

if ($dData === null) {
    $response[] = array("result" => "Error decoding JSON data");
    echo json_encode($response);
    exit();
}

$user = $dData['user'];
$readingGoal = $dData['readingGoal'];


$result = "";

if ($user !== "" && $readingGoal !== "") {

    // Actualizamos la información del objetivo de lectura
    $sqlUpdateGoal = "UPDATE USUARIOS SET objetivo_lectura = ? WHERE usuario = ?";
    $stmtUpdateGoal = $conn->prepare($sqlUpdateGoal);
    $stmtUpdateGoal->bind_param("ds", $readingGoal, $user);
    $stmtUpdateGoal->execute();

    if ($stmtUpdateGoal->affected_rows > 0) {
        $result = "Objetivo de lectura actualizado. ";
    }

    $stmtUpdateGoal->close();

} elseif ($getReadingGoal !== "") {

 

} else {
    $result = "Falta información ";
}

$conn->close();
$response[] = array("result" => $result);
echo json_encode($response);
