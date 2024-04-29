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

$id = $dData['id'];
$type = $dData['type'];

if ($dData === null || !isset($dData['id']) || !isset($dData['type'])) {
    $response = array("result" => "Falta información");
    http_response_code(400);
    echo json_encode($response);
    exit();
}

if ($type === 'book') {
    // Borrar libro de COLECCIONES_has_LIBROS 
    $sql1 = "DELETE FROM COLECCIONES_has_LIBROS WHERE LIBROS_id_libro = ?";
    $stmt1 = $conn->prepare($sql1);
    $stmt1->bind_param("i", $id);
    $stmt1->execute();

    // Borrar libro de LIBROS 
    $sql2 = "DELETE FROM LIBROS WHERE id_libro = ?";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("i", $id);
    $stmt2->execute();

    if ($stmt1->affected_rows > 0 && $stmt2->affected_rows > 0) {
        $response = array("result" => "Libro eliminaod con éxito");
    } else {
        $response = array("result" => "Error al borra el libro");
        http_response_code(500);
    }

    $stmt1->close();
    $stmt2->close();

} elseif ($type === 'collection') {
    //cogemos IDs de libros dentro de colección
   $sql1 = "SELECT LIBROS_id_libro FROM COLECCIONES_has_LIBROS WHERE COLECCIONES_id_coleccion = ?";
   $stmt1 = $conn->prepare($sql1);
   $stmt1->bind_param("i", $id);
   $stmt1->execute();
   $result = $stmt1->get_result();
   $bookIds = [];
   while ($row = $result->fetch_assoc()) {
       $bookIds[] = $row['LIBROS_id_libro'];
   }
   $stmt1->close();

   // Borramos colleción de COLECCIONES_has_LIBROS 
   $sql2 = "DELETE FROM COLECCIONES_has_LIBROS WHERE COLECCIONES_id_coleccion = ?";
   $stmt2 = $conn->prepare($sql2);
   $stmt2->bind_param("i", $id);
   $stmt2->execute();

   // Borramos libros que pertenecen a colleción en la tabla LIBROS 
   $sql3 = "DELETE FROM LIBROS WHERE id_libro IN (" . implode(',', $bookIds) . ")";
   $stmt3 = $conn->prepare($sql3);
   $stmt3->execute();

   // Borramos colección
   $sql4 = "DELETE FROM COLECCIONES WHERE id_coleccion = ?";
   $stmt4 = $conn->prepare($sql4);
   $stmt4->bind_param("i", $id);
   $stmt4->execute();

   if ($stmt2->affected_rows > 0 && $stmt3->affected_rows > 0 && $stmt4->affected_rows > 0) {
       $response = array("result" => "Colección eliminada con éxito");
   } else {
       $response = array("result" => "Error al eliminar la colección");
       http_response_code(500);
   }

   $stmt2->close();
   $stmt3->close();
   $stmt4->close();

} elseif ($type === 'profile') {
    
    // Conseguimos las colecciones del usuario
    $sql1 = "SELECT DISTINCT c.id_coleccion 
              FROM COLECCIONES c
              INNER JOIN COLECCIONES_has_LIBROS cl ON c.id_coleccion = cl.COLECCIONES_id_coleccion
              INNER JOIN LIBROS l ON cl.LIBROS_id_libro = l.id_libro
              INNER JOIN USUARIOS u ON l.id_usuario = u.id_usuario
              WHERE u.usuario = ?";
    $stmt1 = $conn->prepare($sql1);
    $stmt1->bind_param("s", $id); 
    $stmt1->execute();
    $result = $stmt1->get_result();
    $collectionIds = [];
    while ($row = $result->fetch_assoc()) {
        $collectionIds[] = $row['id_coleccion'];
    }
    $stmt1->close();

    $quotedIds = array_map(function($value) {
        return "'$value'";
    }, $collectionIds);

    $collectionIds = implode(',', $quotedIds);

    // Borramos los links entre las colecciones
    $sql2 = "DELETE FROM COLECCIONES_has_LIBROS WHERE COLECCIONES_id_coleccion IN ($collectionIds)";
    $conn->query($sql2); 

    // Borramos las colecciones del usuario
    $sql4 = "DELETE FROM COLECCIONES WHERE id_coleccion IN ($collectionIds)";
    $conn->query($sql4); 

    // Borramos los libros del usuario
    $sql3 = "DELETE FROM LIBROS WHERE id_usuario IN (SELECT id_usuario FROM USUARIOS WHERE usuario = ?)";
    $stmt3 = $conn->prepare($sql3);
    $stmt3->bind_param("s", $id); 
    $stmt3->execute();
    $stmt3->close(); 

    // Borramos al usuario
    $sql5 = "DELETE FROM USUARIOS WHERE usuario = ?";
    $stmt5 = $conn->prepare($sql5);
    $stmt5->bind_param("s", $id); 
    $stmt5->execute();

    if ($stmt5->affected_rows > 0) {
        $response = array("result" => "Perfil eliminado con éxito");
    } else {
        $response = array("result" => "Error al eliminar el perfil");
        http_response_code(500);
    }


    if ($stmt5->affected_rows > 0) {
        $response = array("result" => "Perfil eliminado con éxito");
    } else {
        $response = array("result" => "Error al eliminar el perfil");
        http_response_code(500);
    }

    $stmt5->close();
}


$conn->close();

echo json_encode($response);
?>


