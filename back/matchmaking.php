<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$timer = 10000;

function MakeMatch($conn, $p0, $p1, $game_id) {
    $insert_query = pg_query($conn, "INSERT into matches (id_0, id_1, game_id) values('{$p0}','{$p1}','{$game_id}') returning id");
    if ($insert_query) {
        $id = pg_fetch_row($insert_query)[0];
        $update_query = pg_query($conn, "UPDATE matchmaking set match_id = '{$id}' where user_id = '{$p0}' or user_id = '{$p1}'");

        if (!$update_query) {
            echo 'ERROR 1 <br>';
        }
    }else {
        echo 'ERROR 2 <br>';
    }
}

if ($conn) {


    $query = pg_query($conn, "SELECT user_id, game_id, last_check from matchmaking where match_id is null");

    if ($query) {
        $data = pg_fetch_all($query);

        $date = new DateTime();
        $c_now = (int)$date->getTimestamp();
        $reqs = array();

        foreach ($data as &$d) {

            if (!($c_now - (int)$d['last_check'] > $timer)) {
                if ($reqs[$d['game_id']] == null) {
                    $reqs[$d['game_id']] = array();
                    array_push($reqs[$d['game_id']], $d['game_id']);
                }
                array_push($reqs[$d['game_id']], $d['user_id']);
            }
        }

        foreach ($reqs as $r) {
            $c = count($r);
            if ($c > 1) {
                for ($i=1; $i+1<$c; $i +=2) {
                    MakeMatch($conn, $r[$i], $r[$i+1], $r[0]);
                }
            }
        }

        exit;
    }
}
echo 'ERROR 3 <br>';
exit;
