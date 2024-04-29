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

$user = $_GET['user'];
if ($user === "") {
    $response[] = array("result" => "Falta información de usuario");
    echo json_encode($response);
    exit();
}

$result = [];

if ($user !== "") {
    // SQL query los libros leidos de cada autor
    $sql_author_count = "SELECT autor, COUNT(*) AS count 
                        FROM LIBROS
                        WHERE id_usuario IN (
                            SELECT id_usuario 
                            FROM USUARIOS 
                            WHERE usuario = ?
                        ) AND autor IS NOT NULL AND autor <> ''
                        GROUP BY autor";

    $stmt_author_count = $conn->prepare($sql_author_count);
    $stmt_author_count->bind_param("s", $user);
    $stmt_author_count->execute();
    $stmt_author_count->bind_result($author, $cantidad);

    while ($stmt_author_count->fetch()) {
        $result[] = array($author, $cantidad);
    }

    $stmt_author_count->close();
} else {
    $result = "Falta información de usuario";
}

$conn->close();

$response[] = $result;
echo json_encode($response);
?>
