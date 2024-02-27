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

// Check if JSON data is decoded successfully
if ($dData === null) {
    $response[] = array("result" => "Error decoding JSON data");
    echo json_encode($response);
    exit();
}

$user = $dData['user'];

$result = "";

if ($user !== "") {

    // Conseguimos todas las colecciones del usuario
    $sql = "SELECT id_coleccion, nombre, portada FROM COLECCIONES 
            WHERE id_coleccion IN (SELECT COLECCIONES_id_coleccion FROM COLECCIONES_has_LIBROS 
                                   WHERE LIBROS_id_libro IN (SELECT id_libro FROM LIBROS 
                                                              WHERE id_usuario = (SELECT id_usuario FROM USUARIOS WHERE usuario = ?)))";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($coleccionId, $collectionName, $collectionCover);

        $collections = array();

        while ($stmt->fetch()) {
            $collection = array(
                "id_coleccion" => $coleccionId,
                "nombre" => $collectionName,
                "portada" => $collectionCover
            );
            $collections[] = $collection;
        }

        $result = $collections;
    } else {
        $result = "Ninguna colección de $user";
    }

    $stmt->close();
} else {
    $result = "Falta información de usuario";
}

$conn->close();
$response[] = array("result" => $result);
echo json_encode($response);
?>
