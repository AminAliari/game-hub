<!-- Developer: Amin ALiari -->

<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$port = "port = 5432";
$dbname = "dbname = depbggso4jp8k8";
$host = "host = ec2-54-75-245-94.eu-west-1.compute.amazonaws.com";
$credentials = "user = tlvgwbjynouyyn password=73b668d90662a5678c23f2f7991f4b75e304b052a9c5d5f8019420238da23a5e";

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
