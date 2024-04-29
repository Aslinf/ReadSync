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

$user = $_GET['user'];
if ($user === "") {
    $response[] = array("result" => "Falta información de usuario");
    echo json_encode($response);
    exit();
}

if ($user !== "") {

    // cogemos y devolvemos el obetivo de lectura del usuario
    $sqlSelectGoal = "SELECT objetivo_lectura FROM USUARIOS WHERE usuario = ?";
    $stmtSelectGoal = $conn->prepare($sqlSelectGoal);
    $stmtSelectGoal->bind_param("s", $user);
    $stmtSelectGoal->execute();
    $stmtSelectGoal->bind_result($objetivoLectura);
    $stmtSelectGoal->fetch();
    $stmtSelectGoal->close();

    // miramos que este no este vació, sea nulo o igual a 0
    if ($objetivoLectura === "" || $objetivoLectura === null || $objetivoLectura == 0) {
        $response[] = array("result" => "No hay objetivo");
    } else {
        // contamos los libros leídos este año
        $year = date("Y"); // conseguimos el año actual
        $sqlCountBooks = "SELECT COUNT(*) FROM LIBROS WHERE id_usuario = (SELECT id_usuario FROM USUARIOS WHERE usuario = ?) AND YEAR(fecha_leido) = ?";
        $stmtCountBooks = $conn->prepare($sqlCountBooks);
        $stmtCountBooks->bind_param("si", $user, $year);
        $stmtCountBooks->execute();
        $stmtCountBooks->bind_result($numBooksRead);
        $stmtCountBooks->fetch();
        $stmtCountBooks->close();

        $response[] = array("reading_goal" => $objetivoLectura, "num_books_read" => $numBooksRead);
    }

} else {
    $result = "Falta información";
    $response[] = array("result" => $result);
}

$conn->close();
echo json_encode($response);

?>