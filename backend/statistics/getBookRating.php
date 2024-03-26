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
    // SQL query que consigue los libros del usuario que tienen 5 estrellas
    $sql_books_query = "SELECT ID, nombre, portada 
                        FROM LIBROS
                        WHERE id_usuario IN (
                            SELECT id_usuario 
                            FROM USUARIOS 
                            WHERE usuario = ?
                        ) AND calificacion = 5";

    $stmt_books_query = $conn->prepare($sql_books_query);
    $stmt_books_query->bind_param("s", $user);
    $stmt_books_query->execute();
    $stmt_books_query->bind_result($bookID, $bookName, $bookCover);

    while ($stmt_books_query->fetch()) {
        $result[] = array("ID" => $bookID, "nombre" => $bookName, "portada" => $bookCover);
    }

    $stmt_books_query->close();
} else {
    $result = "Falta información de usuario";
}

$conn->close();

$response[] = $result;
echo json_encode($response);
?>
