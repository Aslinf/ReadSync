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

$result = "";

if ($user !== "") {

    // Miramos si el usuario tiene la colección "Leídos"
    $sqlCheckCollection = "SELECT id_coleccion FROM COLECCIONES WHERE nombre = 'Leídos' AND id_coleccion IN (SELECT COLECCIONES_id_coleccion FROM COLECCIONES_has_LIBROS WHERE LIBROS_id_libro IN (SELECT id_libro FROM LIBROS WHERE id_usuario = (SELECT id_usuario FROM USUARIOS WHERE usuario = ?)))";
    $stmtCheckCollection = $conn->prepare($sqlCheckCollection);
    $stmtCheckCollection->bind_param("s", $user);
    $stmtCheckCollection->execute();
    $stmtCheckCollection->store_result();

    if ($stmtCheckCollection->num_rows > 0) {
        // Colección "Leídos" existe para el usuario
        $stmtCheckCollection->bind_result($idCollection);
        $stmtCheckCollection->fetch();

        // Mirar si el libro ya existe en la colección "Leídos"
        $sqlCheckBook = "SELECT LIBROS_id_libro FROM COLECCIONES_has_LIBROS WHERE COLECCIONES_id_coleccion = ? AND LIBROS_id_libro IN (SELECT id_libro FROM LIBROS WHERE ID = ?)";
        $stmtCheckBook = $conn->prepare($sqlCheckBook);
        $stmtCheckBook->bind_param("is", $idCollection, $ID);
        $stmtCheckBook->execute();
        $stmtCheckBook->store_result();

        if ($stmtCheckBook->num_rows > 0) {
            // El libro ya existe en la colección "Leídos", actualizamos la versión
            $stmtCheckBook->bind_result($bookId);
            $stmtCheckBook->fetch();

            $sqlUpdateBook = "UPDATE LIBROS SET genero = COALESCE(NULLIF(?, ''), genero), 
                                                ID = COALESCE(NULLIF(?, ''), ID), 
                                                autor = COALESCE(NULLIF(?, ''), autor), 
                                                paginas = COALESCE(NULLIF(?, ''), paginas), 
                                                comentario = COALESCE(NULLIF(?, ''), comentario), 
                                                calificacion = COALESCE(NULLIF(?, ''), calificacion), 
                                                formato = COALESCE(NULLIF(?, ''), formato), 
                                                portada = COALESCE(NULLIF(?, ''), portada) 
                              WHERE id_libro = ?";
            $stmtUpdateBook = $conn->prepare($sqlUpdateBook);
            $stmtUpdateBook->bind_param("ssssssssi", $categories, $ID, $author, $pages, $comment, $rating, $format, $portada, $bookId);
            $stmtUpdateBook->execute();

            if ($stmtUpdateBook->affected_rows > 0) {
                $result = "Información actualizada. ";
            } else {
                $result = "Error actualizando la información. ";
            }

            $stmtUpdateBook->close();
        } else {
            // El libro no está en la colección "Leídos", lo añadimos
            $sqlInsertBook = "INSERT INTO LIBROS (nombre, genero, ID, autor, paginas, comentario, calificacion, formato, portada, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT id_usuario FROM USUARIOS WHERE usuario = ?))";
            $stmtInsertBook = $conn->prepare($sqlInsertBook);
            $stmtInsertBook->bind_param("ssssssdsss", $bookName, $categories, $ID, $author, $pages, $comment, $rating, $format, $portada, $user);
            $stmtInsertBook->execute();

            if ($stmtInsertBook->affected_rows > 0) {
                $result = "Libro añadido con éxito. ";

                // Conseguimos el ID del libro
                $bookId = $stmtInsertBook->insert_id;

                // Enlazamos el libro a la colección "Leídos"
                $sqlLinkBook = "INSERT INTO COLECCIONES_has_LIBROS (COLECCIONES_id_coleccion, LIBROS_id_libro) VALUES (?, ?)";
                $stmtLinkBook = $conn->prepare($sqlLinkBook);
                $stmtLinkBook->bind_param("ii", $idCollection, $bookId);
                $stmtLinkBook->execute();

                if ($stmtLinkBook->affected_rows > 0) {
                    $result .= "Enlazado a la colección con éxito";
                } else {
                    $result .= "Error al enlazar a la colección";
                }

                $stmtLinkBook->close();
            } else {
                $result = "Error añadiendo el libro. ";
            }

            $stmtInsertBook->close();
        }

    } else {
        // Colección "Leídos" no existe, así que la creamos
        $sqlCreateCollection = "INSERT INTO COLECCIONES (nombre) VALUES ('Leídos')";
        if ($conn->query($sqlCreateCollection) === TRUE) {
            $idCollection = $conn->insert_id;

            // Ahora añadimos el libro a la colección "Leídos"
            $sqlInsertBook = "INSERT INTO LIBROS (nombre, genero, ID, autor, paginas, comentario, calificacion, formato, portada, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT id_usuario FROM USUARIOS WHERE usuario = ?))";
            $stmtInsertBook = $conn->prepare($sqlInsertBook);
            $stmtInsertBook->bind_param("ssssssdsss", $bookName, $categories, $ID, $author, $pages, $comment, $rating, $format, $portada, $user);
            $stmtInsertBook->execute();

            if ($stmtInsertBook->affected_rows > 0) {
                $result = "Libro añadido con éxito. ";

                // Conseguimos el ID del libro
                $bookId = $stmtInsertBook->insert_id;

                // Enlazamos el libro a la colección "Leídos"
                $sqlLinkBook = "INSERT INTO COLECCIONES_has_LIBROS (COLECCIONES_id_coleccion, LIBROS_id_libro) VALUES (?, ?)";
                $stmtLinkBook = $conn->prepare($sqlLinkBook);
                $stmtLinkBook->bind_param("ii", $idCollection, $bookId);
                $stmtLinkBook->execute();

                $stmtLinkBook->close();
            } else {
                $result = "Error añadiendo el libro. ";
            }

            $stmtInsertBook->close();
        } else {
            $result = "Error creando la colección 'Leídos': " . $conn->error;
        }
    }

} else {
    $result = "Falta información del usuario.";
}

$response[] = array("result" => $result);
echo json_encode($response);

?>


