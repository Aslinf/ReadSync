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

$result = "";

if ($user !== "") {

    // SQL query para encontrar el libro con mayor num de páginas en la biblioteca
    $sql_max_pages_library = "SELECT l.nombre, l.portada, l.ID, MAX(l.paginas) AS max_pages
                              FROM LIBROS l
                              WHERE l.id_usuario = (SELECT u.id_usuario FROM USUARIOS u WHERE u.usuario = ?)
                              GROUP BY l.nombre
                              ORDER BY max_pages DESC
                              LIMIT 1";

    $stmt_max_pages_library = $conn->prepare($sql_max_pages_library);
    $stmt_max_pages_library->bind_param("s", $user);
    $stmt_max_pages_library->execute();
    $stmt_max_pages_library->bind_result($max_pages_book_name_library, $portada_library, $ID_library, $max_pages_library);
    $stmt_max_pages_library->fetch();
    $stmt_max_pages_library->close();

    // SQL query para encontrar el libro leído con mayor núm de páginas
    $sql_max_pages_read = "SELECT l.nombre, l.portada, l.ID, MAX(l.paginas) AS max_pages
                           FROM LIBROS l
                           INNER JOIN COLECCIONES_has_LIBROS cl ON l.id_libro = cl.LIBROS_id_libro
                           INNER JOIN COLECCIONES c ON cl.COLECCIONES_id_coleccion = c.id_coleccion
                           WHERE l.id_usuario = (SELECT id_usuario FROM USUARIOS WHERE usuario = ?)
                           AND c.nombre = 'Leídos'
                           GROUP BY l.nombre
                           ORDER BY max_pages DESC
                           LIMIT 1";

    $stmt_max_pages_read = $conn->prepare($sql_max_pages_read);
    $stmt_max_pages_read->bind_param("s", $user);
    $stmt_max_pages_read->execute();
    $stmt_max_pages_read->bind_result($max_pages_book_name_read, $portada_read, $ID_read, $max_pages_read);
    $stmt_max_pages_read->fetch();
    $stmt_max_pages_read->close();

    // SQL query para encontrar la suma de todas las páginas leídas
    $sql_total_pages_read = "SELECT SUM(paginas) AS total_pages
                        FROM (
                            SELECT DISTINCT paginas
                            FROM LIBROS
                            WHERE id_usuario = (SELECT id_usuario FROM USUARIOS WHERE usuario = ?)
                            GROUP BY ID
                        ) AS unique_books";

    $stmt_total_pages = $conn->prepare($sql_total_pages_read);
    $stmt_total_pages->bind_param("s", $user);
    $stmt_total_pages->execute();
    $stmt_total_pages->bind_result($total_pages_read);
    $stmt_total_pages->fetch();
    $stmt_total_pages->close();

    $result = array(
        "max_pages_book_name_library" => $max_pages_book_name_library,
        "portada_library" => $portada_library,
        "ID_library" => $ID_library,
        "max_pages_library" => $max_pages_library,
        "max_pages_book_name_read" => $max_pages_book_name_read,
        "portada_read" => $portada_read,
        "ID_read" => $ID_read,
        "max_pages_read" => $max_pages_read,
        "total_pages" => $total_pages_read
    );

} else {
    $result = "Falta información de usuario";
}

$conn->close();
$response[] = array($result);
echo json_encode($response);
?>

