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

$resultAll = [];
$resultLeidos = [];

if ($user !== "") {

    $uniqueGenresPerBookAll = [];
    $uniqueGenresPerBookLeidos = [];

    // SQL query que cuenta los generos de todas las colecciones
    $sql_genres_all = "SELECT l.ID, l.genero
                    FROM LIBROS l
                    JOIN USUARIOS u ON l.id_usuario = u.id_usuario
                    JOIN COLECCIONES_has_LIBROS cl ON cl.LIBROS_id_libro = l.id_libro
                    JOIN COLECCIONES c ON c.id_coleccion = cl.COLECCIONES_id_coleccion
                    WHERE u.usuario = ? AND l.genero IS NOT NULL AND l.genero <> ''";

    $stmt_genres_all = $conn->prepare($sql_genres_all);
    $stmt_genres_all->bind_param("s", $user);
    $stmt_genres_all->execute();
    $stmt_genres_all->bind_result($bookId, $generosAll);

    while ($stmt_genres_all->fetch()) {
        $genreArrayAll = array_map('trim', explode(",", $generosAll));
        foreach ($genreArrayAll as $genre) {
            // Miramos si el ID del libro ya ha sido contado para no repetir libros
            $bookGenresAll = isset($uniqueGenresPerBookAll[$bookId]) ? $uniqueGenresPerBookAll[$bookId] : [];
            if (!in_array($genre, $bookGenresAll)) {
                $bookGenresAll[] = $genre;
                $uniqueGenresPerBookAll[$bookId] = $bookGenresAll;
                $foundKeyAll = array_search($genre, array_column($resultAll, 'genre'));
                if ($foundKeyAll !== false) {
                    $resultAll[$foundKeyAll]['count']++;
                } else {
                    $resultAll[] = array("genre" => $genre, "count" => 1); 
                }
            }
        }
    }

    $stmt_genres_all->close();

    // SQL query que cuenta los generos de la colección leídos
    $sql_genres_leidos = "SELECT l.ID, l.genero
                        FROM LIBROS l
                        JOIN USUARIOS u ON l.id_usuario = u.id_usuario
                        JOIN COLECCIONES_has_LIBROS cl ON cl.LIBROS_id_libro = l.id_libro
                        JOIN COLECCIONES c ON c.id_coleccion = cl.COLECCIONES_id_coleccion
                        WHERE u.usuario = ? AND c.nombre = 'Leídos' AND l.genero IS NOT NULL AND l.genero <> ''";

    $stmt_genres_leidos = $conn->prepare($sql_genres_leidos);
    $stmt_genres_leidos->bind_param("s", $user);
    $stmt_genres_leidos->execute();
    $stmt_genres_leidos->bind_result($bookIdLeidos, $generosLeidos);

    while ($stmt_genres_leidos->fetch()) {
        $genreArrayLeidos = array_map('trim', explode(",", $generosLeidos));
        foreach ($genreArrayLeidos as $genreLeidos) {
            $bookGenresLeidos = isset($uniqueGenresPerBookLeidos[$bookIdLeidos]) ? $uniqueGenresPerBookLeidos[$bookIdLeidos] : [];
            if (!in_array($genreLeidos, $bookGenresLeidos)) {
                $bookGenresLeidos[] = $genreLeidos;
                $uniqueGenresPerBookLeidos[$bookIdLeidos] = $bookGenresLeidos;
                $foundKeyLeidos = array_search($genreLeidos, array_column($resultLeidos, 'genre'));
                if ($foundKeyLeidos !== false) {
                    $resultLeidos[$foundKeyLeidos]['count']++;
                } else {
                    $resultLeidos[] = array("genre" => $genreLeidos, "count" => 1);
                }
            }
        }
    }

    $stmt_genres_leidos->close();

} else {
    $resultAll = "Falta información de usuario";
}

$conn->close();

$response[] = array("all_collections" => $resultAll, "leidos_collection" => $resultLeidos);
echo json_encode($response);
?>








