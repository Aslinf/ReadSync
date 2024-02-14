<?php

$host = "readsync.uabcilab.cat";
$db_username = "readsync";
$db_password = "*12345aA!*";
$db_name = "readsync";

$conn = new mysqli($host, $db_username, $db_password, $db_name);

if (mysqli_connect_error()) {
    $response[] = array("result" => mysqli_connect_error());
    echo json_encode($response);
    exit();
}