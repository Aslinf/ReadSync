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
$categories = $dData['categories'];
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

    // Miramos si el libro ya existe en la biblioteca del usuario
    $sqlCheckBookExists = "SELECT id_libro FROM LIBROS WHERE ID = ? AND id_usuario = (SELECT id_usuario FROM USUARIOS WHERE usuario = ?)";
    $stmtCheckBookExists = $conn->prepare($sqlCheckBookExists);
    $stmtCheckBookExists->bind_param("ss", $ID, $user);
    $stmtCheckBookExists->execute();
    $stmtCheckBookExists->store_result();

    if ($stmtCheckBookExists->num_rows > 0) {
        // Si el libro existe, conseguimos su ID
        $stmtCheckBookExists->bind_result($bookId);
        $stmtCheckBookExists->fetch();
        $stmtCheckBookExists->close();

        // Añadimos la nueva colección
        $sqlCollection = "INSERT INTO COLECCIONES (nombre, portada) VALUES (?, ?)";
        $stmtCollection = $conn->prepare($sqlCollection);
        $stmtCollection->bind_param("ss", $collectionName, $collectionCover);
        $stmtCollection->execute();

        if ($stmtCollection->affected_rows > 0) {
            $result .= "Colección añadida con éxito. ";

            // Conseguimos el id de la nueva colección
            $collectionId = $stmtCollection->insert_id;

            // Añadimos el libro a la nueva colección
            $sqlLinkBookCollection = "INSERT INTO COLECCIONES_has_LIBROS (COLECCIONES_id_coleccion, LIBROS_id_libro) VALUES (?, ?)";
            $stmtLinkBookCollection = $conn->prepare($sqlLinkBookCollection);
            $stmtLinkBookCollection->bind_param("ii", $collectionId, $bookId);
            $stmtLinkBookCollection->execute();

            if($stmtLinkBookCollection->affected_rows > 0){
                $result .= "Libro añadido con éxito. ";
            } else { 
                $result ="Error añadiendo el libro. "; 
            }

            $stmtLinkBookCollection->close();
        } else {
            $result .= "Error añadiendo la colección. ";
        }

        $stmtCollection->close();
    } else {

        // El libro no existe anteriormente en la biblioteca del usuario, así que lo añadimos
        $sqlBook = "INSERT INTO LIBROS (nombre, genero, ID, autor, paginas, comentario, calificacion, formato, portada, id_usuario) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT id_usuario FROM USUARIOS WHERE usuario = ?))";
        $stmtBook = $conn->prepare($sqlBook);
        $stmtBook->bind_param("ssssisdsss", $bookName, $categories, $ID, $author, $pages, $comment, $rating, $format, $portada, $user);
        $stmtBook->execute();

        if ($stmtBook->affected_rows > 0) {
            $result .= "Libro añadido con éxito. ";

            // Conseguimos el id del libro añadido
            $bookId = $stmtBook->insert_id;

            // Añadimos la nueva collleción
            $sqlCollection = "INSERT INTO COLECCIONES (nombre, portada) VALUES (?, ?)";
            $stmtCollection = $conn->prepare($sqlCollection);
            $stmtCollection->bind_param("ss", $collectionName, $collectionCover);
            $stmtCollection->execute();

            if ($stmtCollection->affected_rows > 0) {
                $result .= "Colección añadida con éxito. ";

                // conseguimos el id de la nueva colección
                $collectionId = $stmtCollection->insert_id;

                // Añadimos el nuevo libro a la nueva colección
                $sqlLinkBookCollection = "INSERT INTO COLECCIONES_has_LIBROS (COLECCIONES_id_coleccion, LIBROS_id_libro) VALUES (?, ?)";
                $stmtLinkBookCollection = $conn->prepare($sqlLinkBookCollection);
                $stmtLinkBookCollection->bind_param("ii", $collectionId, $bookId);
                $stmtLinkBookCollection->execute();

                $stmtLinkBookCollection->close();
            } else {
                $result .= "Error añadiendo la colección. ";
            }

            $stmtCollection->close();

        } else {
            $result .= "Error añadiendo el libro. ";
        }

        $stmtBook->close();
    }
} else {
    $result = "Falta información de usuario";
}

$conn->close();
$response[] = array("result" => $result);
echo json_encode($response);

?>


