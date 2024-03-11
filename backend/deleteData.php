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

if ($dData === null || !isset($dData['id']) || !isset($dData['type'])) {
    $response = array("result" => "Error: Invalid request");
    http_response_code(400);
    echo json_encode($response);
    exit();
}

$id = $dData['id'];
$type = $dData['type'];

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
}

$conn->close();

echo json_encode($response);
?>


