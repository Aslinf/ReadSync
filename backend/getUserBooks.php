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
$collectionID = $dData['collectionID']; 

$result = "";

if ($user !== "" && $collectionID !== "") {

    $sql = "SELECT L.id_libro, L.nombre, L.ID, L.comentario, L.calificacion, L.formato, L.portada
    FROM LIBROS L
    INNER JOIN COLECCIONES_has_LIBROS CL ON L.id_libro = CL.LIBROS_id_libro
    INNER JOIN COLECCIONES C ON CL.COLECCIONES_id_coleccion = C.id_coleccion
    WHERE L.id_usuario = (SELECT id_usuario FROM USUARIOS WHERE usuario = ?)
    AND C.id_coleccion = ?
    AND L.id_libro IN (SELECT LIBROS_id_libro FROM COLECCIONES_has_LIBROS WHERE COLECCIONES_id_coleccion = C.id_coleccion)
    ORDER BY L.nombre";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $user, $collectionID);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($idLibro, $bookName, $ID, $comment, $rating, $format, $portada);

        $books = array();

        while ($stmt->fetch()) {
            $book = array(
                "idLibro" => $idLibro,
                
                "nombre" => $bookName,
                
                "ID" => $ID,
                
                "comentario" => $comment,
                "calificacion" => $rating,
                "formato" => $format,
                "portada" => $portada
            );
            $books[] = $book;
        }

        $result = $books;
    } else {
        $result = "No hay libros en la colección especificada para $user";
    }

    $stmt->close();
} else {
    $result = "Falta información de usuario o nombre de la colección";
}

$conn->close();
$response[] = array("result" => $result);
echo json_encode($response);
?>
