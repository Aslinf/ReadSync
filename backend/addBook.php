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
$idCollection = $dData['collectionID'];

$result = "";

if ($user !== "" && $idCollection !== "") {

   // Primero miramos si el libro existe ya en la biblioteca del usuario
    $sqlCheckBookExists = "SELECT id_libro FROM LIBROS WHERE ID = ? AND id_usuario = (SELECT id_usuario FROM USUARIOS WHERE usuario = ?)";
    $stmtCheckBookExists = $conn->prepare($sqlCheckBookExists);
    $stmtCheckBookExists->bind_param("ss", $ID, $user);
    $stmtCheckBookExists->execute();
    $stmtCheckBookExists->store_result();

    if ($stmtCheckBookExists->num_rows > 0) {

        // Si el libro ya está en la biblioteca, conseguimos su ID
        $stmtCheckBookExists->bind_result($bookId);
        $stmtCheckBookExists->fetch();
        $stmtCheckBookExists->close();

        // Y añadimos el libro a la colección seleccionada
        $sqlLink = "INSERT INTO COLECCIONES_has_LIBROS (COLECCIONES_id_coleccion, LIBROS_id_libro) 
                    VALUES (?, ?)";
        $stmtLink = $conn->prepare($sqlLink);
        $stmtLink->bind_param("ii", $idCollection, $bookId);
        $stmtLink->execute();

        if($stmtLink->affected_rows > 0){
            $result = "Libro añadido con éxito. ";
        } else { 
            $result ="Error añadiendo el libro. "; 
        }

        $stmtLink->close();
        
    } else {

        // El libro no existe en la biblioteca del usuario así que lo añadimos
        $sqlBook = "INSERT INTO LIBROS (nombre, genero, ID, autor, paginas, comentario, calificacion, formato, portada, id_usuario) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT id_usuario FROM USUARIOS WHERE usuario = ?))";
        $stmtBook = $conn->prepare($sqlBook);
        $stmtBook->bind_param("ssssisdsss", $bookName, $categories, $ID, $author, $pages, $comment, $rating, $format, $portada, $user);
        $stmtBook->execute();

        if ($stmtBook->affected_rows > 0) {
            $result = "Libro añadido con éxito. ";

            // Conseguimos el ID del libro añadido
            $bookId = $stmtBook->insert_id;

            // Añadimos el libro a la colección seleccionada
            $sqlLink = "INSERT INTO COLECCIONES_has_LIBROS (COLECCIONES_id_coleccion, LIBROS_id_libro) 
                        VALUES (?, ?)";
            $stmtLink = $conn->prepare($sqlLink);
            $stmtLink->bind_param("ii", $idCollection, $bookId);
            $stmtLink->execute();

            $stmtLink->close();
        } else {
            $result = "Error añadiendo el libro. ";
        }

        $stmtBook->close();
    }
} else {
    $result = "Falta información de usuario. ";
}

$conn->close();
$response[] = array("result" => $result);
echo json_encode($response);

?>



