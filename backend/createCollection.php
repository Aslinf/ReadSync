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
$bookName = $dData['title'];
$genre = $dData['subject'];
$ID = $dData['ID'];
$author = $dData['author'];
$pages = $dData['pages'];
$comment = $dData['comment']; 
$rating = $dData['rating']; 
$format = $dData['format']; 
$portada = $dData['cover'];
$collectionName = $dData['collectionName'];
$collectionCover = ""; 

$result = "";

if ($user !== "") {

    // Añadimos la información del libro a la tabla
    $sqlBook = "INSERT INTO LIBROS (nombre, genero, ID, autor, paginas, comentario, calificacion, formato, portada, id_usuario) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT id_usuario FROM USUARIOS WHERE usuario = ?))";
    $stmtBook = $conn->prepare($sqlBook);
    $stmtBook->bind_param("ssssssisss", $bookName, $genre, $ID, $author, $pages, $comment, $rating, $format, $portada, $user);
    $stmtBook->execute();

    if ($stmtBook->affected_rows > 0) {
        $result .= "Libro añadido con éxito. ";

        // Conseguimos el ID del libro
        $bookId = $stmtBook->insert_id;

        // Añadimos la nueva colección a la tabla
        $sqlCollection = "INSERT INTO COLECCIONES (nombre, portada) VALUES (?, ?)";
        $stmtCollection = $conn->prepare($sqlCollection);
        $stmtCollection->bind_param("ss", $collectionName, $collectionCover);
        $stmtCollection->execute();

        if ($stmtCollection->affected_rows > 0) {
            $result .= "Colección añadida con éxito. ";

            // Conseguimos el ID de la nueva colección
            $collectionId = $stmtCollection->insert_id;

            // Juntamos la nueva colección con el libro
            $sqlBookCollection = "INSERT INTO COLECCIONES_has_LIBROS (COLECCIONES_id_coleccion, LIBROS_id_libro) VALUES (?, ?)";
            $stmtBookCollection = $conn->prepare($sqlBookCollection);
            $stmtBookCollection->bind_param("ii", $collectionId, $bookId);
            $stmtBookCollection->execute();

            $stmtBookCollection->close();
        } else {
            $result .= "Error aañadiendo la colección. ";
        }

        $stmtCollection->close();
    } else {
        $result .= "Error añadiendo el libro. ";
    }

    $stmtBook->close();
    

} else {
    $result = "Falta información de usuario";
}

$conn->close();
$response[] = array("result" => $result);
echo json_encode($response);

?>


