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

$result = "";

if ($user !== "") {

    // SQL query que cuenta el numero de libros en la biblioteca del usuario
    $sql_unique_books = "SELECT COUNT(DISTINCT l.ID) AS unique_books_count
                        FROM USUARIOS u
                        JOIN LIBROS l ON u.id_usuario = l.id_usuario
                        WHERE u.usuario = ?";

    $stmt_unique_books = $conn->prepare($sql_unique_books);
    $stmt_unique_books->bind_param("s", $user);
    $stmt_unique_books->execute();
    $stmt_unique_books->bind_result($numberBooks);
    $stmt_unique_books->fetch();
    $stmt_unique_books->close();

    // SQL query que cueanta solo los libros leídos del usuario
    $sql_unique_books_read = "SELECT COUNT(DISTINCT l.ID) AS unique_books_read_count
                              FROM USUARIOS u
                              JOIN LIBROS l ON u.id_usuario = l.id_usuario
                              JOIN COLECCIONES_has_LIBROS cl ON l.id_libro = cl.LIBROS_id_libro
                              JOIN COLECCIONES c ON cl.COLECCIONES_id_coleccion = c.id_coleccion
                              WHERE u.usuario = ?
                              AND c.nombre = 'Leídos'";

    $stmt_unique_books_read = $conn->prepare($sql_unique_books_read);
    $stmt_unique_books_read->bind_param("s", $user);
    $stmt_unique_books_read->execute();
    $stmt_unique_books_read->bind_result($numberBooksRead);
    $stmt_unique_books_read->fetch();

    if ($numberBooksRead !== null && $numberBooksRead !== false && $numberBooks !== null && $numberBooks !== false){
        $result = array(
            "total_unique_books" => $numberBooks,
            "total_unique_books_read" => $numberBooksRead
        );
    }

    $stmt_unique_books_read->close();

} else {
    $result = "Falta información de usuario".$dData['user']."hola";
}

$conn->close();
$response[] = array("result" => $result);
echo json_encode($response);
?>

