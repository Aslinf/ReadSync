<?php
// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Content-Type: application/json");
    exit();
}

// Handle  POST request (logout logic)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    session_unset();

    session_destroy();

    // enviar respuesta
    $response = array("result" => "Logout successful");
} else {
    $response = array("result" => "Invalid request method");
}

// enviar respuesta
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");
echo json_encode($response);


?>
