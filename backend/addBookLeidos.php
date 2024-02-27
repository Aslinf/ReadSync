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
$bookName = $dData['title'];
$genre = $dData['subject'];
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
    } else {
        // Colección "Leídos" no existe, así que la creamos
        $sqlCheckIfLeidosExists = "SELECT id_coleccion FROM COLECCIONES WHERE nombre = 'Leídos'";
        $stmtCheckIfLeidosExists = $conn->prepare($sqlCheckIfLeidosExists);
        $stmtCheckIfLeidosExists->execute();
        $stmtCheckIfLeidosExists->store_result();

        if ($stmtCheckIfLeidosExists->num_rows === 0) {
            $sqlCreateCollection = "INSERT INTO COLECCIONES (nombre) VALUES ('Leídos')";
            if ($conn->query($sqlCreateCollection) === TRUE) {
                $idCollection = $conn->insert_id;
            } else {
                $result = "Error creando la colección 'Leídos': " . $conn->error;
            }
        } else {
            // Colección "Leídos" existe, conseguimos su ID
            $stmtCheckCollection->bind_result($idCollection);
            $stmtCheckCollection->fetch();
        }

        $stmtCheckIfLeidosExists->close();
    }

    // una vez tenemos el ID de la colección "Leídos"
    if (isset($idCollection) && $idCollection !== "") {
        // Mirar si el usuario ya tiene el libro en sus colecciones
        $sqlCheckBook = "SELECT id_libro FROM LIBROS WHERE nombre = ? AND id_usuario = (SELECT id_usuario FROM USUARIOS WHERE usuario = ?)";
        $stmtCheckBook = $conn->prepare($sqlCheckBook);
        $stmtCheckBook->bind_param("ss", $bookName, $user);
        $stmtCheckBook->execute();
        $stmtCheckBook->store_result();

        if ($stmtCheckBook->num_rows > 0) {
            // Actualizamos la información si el usuario ya tenía el libro
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
            $stmtUpdateBook->bind_param("ssssssssi", $genre, $ID, $author, $pages, $comment, $rating, $format, $portada, $bookId);
            $stmtUpdateBook->execute();

            if ($stmtUpdateBook->affected_rows > 0) {
                $result = "Información actualizada. ";
            } else {
                $result = "Error actualizando la infromación. ";
            }

            $stmtUpdateBook->close();

        } else {
            // El libro no está en ninguna colección, lo añadimos
            $sqlInsertBook = "INSERT INTO LIBROS (nombre, genero, ID, autor, paginas, comentario, calificacion, formato, portada, id_usuario) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT id_usuario FROM USUARIOS WHERE usuario = ?))";
            $stmtInsertBook = $conn->prepare($sqlInsertBook);
            $stmtInsertBook->bind_param("ssssssisss", $bookName, $genre, $ID, $author, $pages, $comment, $rating, $format, $portada, $user);
            $stmtInsertBook->execute();

            if ($stmtInsertBook->affected_rows > 0) {
                $result = "Libro añadido con éxito. ";

                // Conseguimos el ID del libro
                $bookId = $stmtInsertBook->insert_id;

                // Juntamos el libro con la colección en la base de datos
                $sqlLink = "INSERT INTO COLECCIONES_has_LIBROS (COLECCIONES_id_coleccion, LIBROS_id_libro) 
                            VALUES (?, ?)";
                $stmtLink = $conn->prepare($sqlLink);
                $stmtLink->bind_param("ii", $idCollection, $bookId);
                $stmtLink->execute();

                /*if ($stmtLink->affected_rows > 0) {
                    $result .= " and linked to collection successfully";
                } else {
                    $result .= " but failed to link to collection";
                }*/

                $stmtLink->close();
            } else {
                $result = "Error añadiendo el libro. ";
            }

            $stmtInsertBook->close();
        }
    }

} else {
    $result = "Falta información de usuario. ";
}

$conn->close();
$response[] = array("result" => $result);
echo json_encode($response);
?>


