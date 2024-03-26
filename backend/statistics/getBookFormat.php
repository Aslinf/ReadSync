<?php

include("../dataBaseConfig.php");

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

$result = [];

if ($user !== "") {

    // SQL query que cuenta la cantidad de libros leídos en cada formato
    $sql_format_count = "SELECT l.formato, COUNT(*) AS cantidad 
                        FROM LIBROS l
                        JOIN USUARIOS u ON l.id_usuario = u.id_usuario
                        WHERE u.usuario = ? AND l.formato IS NOT NULL AND l.formato <> ''
                        GROUP BY l.formato;";

    $stmt_format_count = $conn->prepare($sql_format_count);
    $stmt_format_count->bind_param("s", $user);
    $stmt_format_count->execute();
    $stmt_format_count->bind_result($bookFormat, $cantidad);
    
    while ($stmt_format_count->fetch()) {
	$result[] =  array($bookFormat, $cantidad);
    }
    $stmt_format_count->close();

} else {
    $result = "Falta información de usuario";
}

$conn->close();
//$response[] = array("result" => $result);

//PROBAR ESTO VV 
$response[] = $result;
echo json_encode($response);
?>
