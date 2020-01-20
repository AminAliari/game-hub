<!-- Developer: Amin ALiari -->

<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$conn = pg_connect("$host $port $dbname $credentials");

if ($conn) {
    $query = pg_query($conn, "UPDATE users set is_online = FALSE");

    if ($query) {
        echo 'OK';
        exit;
    }		
}

echo 'ERROR';
exit;
