<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$port = "port = 5432";
$dbname = "dbname = depbggso4jp8k8";
$host = "host = ec2-54-75-245-94.eu-west-1.compute.amazonaws.com";
$credentials = "user = tlvgwbjynouyyn password=73b668d90662a5678c23f2f7991f4b75e304b052a9c5d5f8019420238da23a5e";

$conn = pg_connect("$host $port $dbname $credentials");

function SetOnline() {
        if (isset($_POST['id'])) {
        $query = pg_query($conn, "UPDATE users set is_online = TRUE where id = '{$_POST['id']}'");
    }
}

if ($conn && isset($_POST['method'])) {

	switch ($_POST['method']) {

		case 'Login':
			if (isset($_POST['username']) && isset($_POST['password'])) {
				$query = pg_query($conn, "SELECT * from users where username = '{$_POST['username']}' and password = '{$_POST['password']}'");

				if ($query) {
					if (pg_num_rows($query) == 1) {
						$rows = pg_fetch_all($query);
						$res = array();

						foreach ($rows as $row) {
							$res[] = $row;
                        }

						print json_encode($res);
					}else{
						echo 'NO';
					}
					exit;
				}
			}
			echo 'ERROR';
			break;

		case 'Signup':
			if (isset($_POST['username']) && isset($_POST['password']) && isset($_POST['firstname']) && isset($_POST['lastname']) && isset($_POST['email']) && isset($_POST['image_url'])) {
				$query = pg_query($conn, "INSERT INTO users (username, password, firstname, lastname, email, image_url) values('{$_POST['username']}', '{$_POST['password']}', '{$_POST['firstname']}', '{$_POST['lastname']}', '{$_POST['email']}', '{$_POST['image_url']}') returning id, username, image_url, firstname, lastname, email");

				if ($query) {
                    $rows = pg_fetch_all($query);
                    $res = array();

                    foreach ($rows as $row) {
                        $res[] = $row;
                    }

                    print json_encode($res);
				}else {
					echo 'NO';
				}
				exit;
			}
			echo 'ERROR';
            break;
            
        case 'UpdateUser':
			if (isset($_POST['id']) && isset($_POST['password']) && isset($_POST['firstname']) && isset($_POST['lastname']) && isset($_POST['email']) && isset($_POST['image_url'])) {
                $query = pg_query($conn, "UPDATE users set password = '{$_POST['password']}', firstname = '{$_POST['firstname']}', lastname = '{$_POST['lastname']}', email = '{$_POST['email']}', image_url = '{$_POST['image_url']}' where id = '{$_POST['id']}'");

				if ($query) {
                    echo 'OK';
				}else {
					echo 'NO';
				}
				exit;
			}
			echo 'ERROR';
            break;
            
        case 'GetUser':
            if (isset($_POST['id'])) {
                $query = pg_query($conn, "SELECT * from users where id = '{$_POST['id']}'");

                if ($query) {
                    $rows = pg_fetch_all($query);
                    $res = array();

                    foreach ($rows as $row) {
                        $res[] = $row;
                    }
                    print json_encode($res);
                    exit;
                }
            }
            echo 'ERROR';
            break;

        case 'GetOnlineUsers':
            if (isset($_POST['id'])) {
                $query = pg_query($conn, "SELECT id, username, image_url, is_online from users where is_online = TRUE and id != '{$_POST['id']}'");

                if ($query) {
                    $rows = pg_fetch_all($query);
                    $res = array();

                    foreach ($rows as $row) {
                        $res[] = $row;
                    }
                    
                    SetOnline();
                    print json_encode($res);
                    exit;
                }
            }
            echo 'ERROR';
            break;
        
        case 'AddFriend':
            if (isset($_POST['id']) && isset($_POST['friend_id'])) {
                $query = pg_query($conn, "INSERT INTO friends (left_id, right_id) values('{$_POST['id']}', '{$_POST['friend_id']}')");

				if ($query) {
					echo 'OK';
					exit;
				}
            }
        echo 'ERROR';
        break;

        case 'GetFriends':
            if (isset($_POST['id'])) {
                $query = pg_query($conn, "SELECT case when left_id = '{$_POST['id']}' then right_id when right_id = '{$_POST['id']}' then left_id end as id from friends");

                if ($query) {
                    $rows = pg_fetch_all($query);
                    $res = array();

                    foreach ($rows as $row) {
                        $res[] = $row;
                    }
                    print json_encode($res);
                    exit;
                }
            }
			echo 'ERROR';
            break;

        case 'GetBestGame':
            $query = pg_query($conn, "SELECT g.id as game_id, current_playing, g.score, created_date, total_played, username, u.id, u.image_url from (SELECT * from games order by score desc limit 1) as g join users as u on g.designer_id = u.id");

            if ($query) {
                $rows = pg_fetch_all($query);
                $res = array();

                foreach ($rows as $row) {
                    $res[] = $row;
                }
                print json_encode($res);
                exit;
            }
            echo 'ERROR';
            break;

        case 'GetNewestGame':
            $query = pg_query($conn, "SELECT g.id as game_id, g.score, current_playing, created_date, total_played, username, u.id, u.image_url from (select * from games order by created_date desc limit 1) as g join users as u on g.designer_id = u.id");

            if ($query) {
                $rows = pg_fetch_all($query);
                $res = array();

                foreach ($rows as $row) {
                    $res[] = $row;
                }
                print json_encode($res);
                exit;
            }
            echo 'ERROR';
            break;
        
        case 'GetMostPlayedGame':
            $query = pg_query($conn, "SELECT g.id as game_id, g.score, current_playing, created_date, total_played, username, u.id, u.image_url from (select * from games order by current_playing desc limit 1) as g join users as u on g.designer_id = u.id");

            if ($query) {
                $rows = pg_fetch_all($query);
                $res = array();

                foreach ($rows as $row) {
                    $res[] = $row;
                }
                print json_encode($res);
                exit;
            }
            echo 'ERROR';
            break;
        
        case 'GetProfileSummary':
			if (isset($_POST['id'])) {
                $query = pg_query($conn, "SELECT id, total_count, total_wins, (total_count-total_wins) as total_lose, score from (select count(winner_id) as total_count from games_results where left_id = '{$_POST['id']}' or right_id = '{$_POST['id']}') as r1 cross join (select winner_id as id, count(winner_id) as total_wins from games_results where winner_id = '{$_POST['id']}' group by winner_id) as r2 cross join (select score from users where id = '{$_POST['id']}') as r3");
                
                if ($query) {
                    $rows = pg_fetch_all($query);
                    $res = array();

                    foreach ($rows as $row) {
                        $res[] = $row;
                    }
                    print json_encode($res);
                    exit;
                }
            }
            echo 'ERROR';
            break;

        case 'GetProfilePlayedGames':
            if (isset($_POST['id'])) {
                $query = pg_query($conn, "SELECT results.id, played_date, winner_id, username, (case when left_id = 1 then right_id when right_id = 1 then left_id end) as enemy_id from (select * from games_results where left_id = '{$_POST['id']}' or right_id = '{$_POST['id']}') as results join users as u on u.id = (case when left_id = '{$_POST['id']}' then right_id when right_id = '{$_POST['id']}' then left_id end)");

                if ($query) {
                    $rows = pg_fetch_all($query);
                    $res = array();

                    foreach ($rows as $row) {
                        $res[] = $row;
                    }
                    print json_encode($res);
                    exit;
                }
            }
			echo 'ERROR';
            break;

        case 'GetProfileDesignedGames':
            if (isset($_POST['id'])) {
                $query = pg_query($conn, "SELECT id, created_date, total_played, score from games where designer_id = '{$_POST['id']}'");

                if ($query) {
                    $rows = pg_fetch_all($query);
                    $res = array();

                    foreach ($rows as $row) {
                        $res[] = $row;
                    }
                    print json_encode($res);
                    exit;
                }
            }
			echo 'ERROR';
            break;
            
        case 'GetGames':
            $query = pg_query($conn, "SELECT g.id, g.score, current_playing, created_date, designer_id, total_played, username from games as g join users as u on designer_id = u.id");

            if ($query) {
                $rows = pg_fetch_all($query);
                $res = array();

                foreach ($rows as $row) {
                    $res[] = $row;
                }

                print json_encode($res);
                exit;
            }
            echo 'ERROR';
            break;

        case 'GetGameComments':
            if (isset($_POST['id'])) {
                $query = pg_query($conn, "SELECT u.username, u.image_url, u.id as reviwer_id, gc.comment from (select * from games_comments where game_id = '{$_POST['id']}' and is_approved=true) as gc join users as u on u.id = gc.reviewer_id");

                if ($query) {
                    $rows = pg_fetch_all($query);
                    $res = array();

                    foreach ($rows as $row) {
                        $res[] = $row;
                    }

                    print json_encode($res);
                    exit;
                }
            }
            echo 'ERROR';
            break;

        case 'GetUsers':
            $query = pg_query($conn, "SELECT u.id, u.username, u.image_url, u.score, u.is_online, coalesce(wr.total_wins, 0) as total_wins, coalesce(tr.total_played,0) as total_played, coalesce(dr.count,0) as total_designed,coalesce(mr.max_score,0) as max_score, coalesce(mr.max_played,0) as max_played from (select * from users) as u left outer join (select winner_id, count(winner_id) as total_wins from games_results group by (winner_id)) as wr on u.id = wr.winner_id left outer join (select coalesce(lr.id, rr.id) as id, (coalesce(lr.c,0) + coalesce(rr.c, 0)) as total_played from (select left_id as id, count(left_id) as c from games_results group by left_id) as lr full outer join (select right_id as id, count(right_id) as c from games_results group by right_id) as rr on lr.id = rr.id) as tr on tr.id = u.id left outer join (select designer_id as id, count(designer_id) from games group by designer_id) as dr on dr.id = u.id left outer join (select designer_id as id, max(score) as max_score, max(total_played) as max_played from games group by designer_id) as mr on mr.id = u.id");

            if ($query) {
                $rows = pg_fetch_all($query);
                $res = array();

                foreach ($rows as $row) {
                    $res[] = $row;
                }

                print json_encode($res);
                exit;
            }
            echo 'ERROR';
            break;

        case 'DesignGame':
            if (isset($_POST['designer_id']) && isset($_POST['current_number_lose']) && isset($_POST['past_number_lose']) && isset($_POST['max_score'])) {
                $query = pg_query($conn, "INSERT INTO games (designer_id, current_number_lose, past_number_lose, max_score) values('{$_POST['designer_id']}', '{$_POST['current_number_lose']}', '{$_POST['past_number_lose']}', '{$_POST['max_score']}')");

				if ($query) {
					echo 'OK';
					exit;
				}
            }
            echo 'ERROR';
            break;

        case 'SubmitUserComment':
            if (isset($_POST['reviewer_id']) && isset($_POST['score']) && isset($_POST['comment']) && isset($_POST['user_id']) && isset($_POST['result_id'])) {
                $query = pg_query($conn, "INSERT INTO users_comments (reviewer_id, score, comment, user_id, result_id) values('{$_POST['reviewer_id']}', '{$_POST['score']}', '{$_POST['comment']}', '{$_POST['user_id']}', '{$_POST['result_id']}')");

				if ($query) {
					echo 'OK';
					exit;
				}
            }
            echo 'ERROR';
            break;

        case 'SubmitGameComment':
            if (isset($_POST['reviewer_id']) && isset($_POST['score']) && isset($_POST['comment']) && isset($_POST['game_id'])) {
                $query = pg_query($conn, "INSERT INTO games_comments (reviewer_id, score, comment, game_id) values('{$_POST['reviewer_id']}', '{$_POST['score']}', '{$_POST['comment']}', '{$_POST['game_id']}')");

				if ($query) {
					echo 'OK';
					exit;
				}
            }
            echo 'ERROR';
            break;

        case 'GetGameResult':
            if (isset($_POST['result_id'])) {
                $query = pg_query($conn, "SELECT played_date, winner_id, left_id as p0_user_id, p0_username, p0_image_url, p0_comment, right_id as p1_user_id, p1_username, p1_image_url, p1_comment from (select * from games_results where id = '{$_POST['result_id']}') as r join (select id, image_url as p0_image_url, username as p0_username from users) as u1 on left_id = u1.id join (select id, image_url as p1_image_url, username as p1_username from users) as u2 on right_id = u2.id left outer join (select reviewer_id, comment as p0_comment from users_comments where is_approved=true) as uc1 on uc1.reviewer_id = r.left_id left outer join (select reviewer_id, comment as p1_comment from users_comments where is_approved=true) as uc2 on uc2.reviewer_id = r.right_id");

                if ($query) {
                    $rows = pg_fetch_all($query);
                    $res = array();

                    foreach ($rows as $row) {
                        $res[] = $row;
                    }

                    print json_encode($res);
                    exit;
                }
            }
            echo 'ERROR';
            break;
        
        case 'GetUsersComments':
            $query = pg_query($conn, "SELECT id, comment from users_comments where is_approved = false");

            if ($query) {
                $rows = pg_fetch_all($query);
                $res = array();

                foreach ($rows as $row) {
                    $res[] = $row;
                }

                print json_encode($res);
                exit;
            }
            echo 'ERROR';
            break;

        case 'GetGamesComments':
            $query = pg_query($conn, "SELECT id, comment from games_comments where is_approved = false");

            if ($query) {
                $rows = pg_fetch_all($query);
                $res = array();

                foreach ($rows as $row) {
                    $res[] = $row;
                }

                print json_encode($res);
                exit;
            }
            echo 'ERROR';
            break;

        case 'ApproveUserComment':
            if (isset($_POST['comment_id'])) {
                $query = pg_query($conn, "UPDATE users_comments set is_approved = true where id='{$_POST['comment_id']}'");

                if ($query) {
                    echo 'OK';
                    exit;
                }
            }
            echo 'ERROR';
            break;

        case 'ApproveGameComment':
            if (isset($_POST['comment_id'])) {
                $query = pg_query($conn, "UPDATE games_comments set is_approved = true where id='{$_POST['comment_id']}'");

                if ($query) {
                    echo 'OK';
                    exit;
                }
            }
            echo 'ERROR';
            break;
        
        // matchmaking - user requests
        case 'RequestGame':
            if (isset($_POST['user_id']) && isset($_POST['game_id'])) {
                $query = pg_query($conn, "INSERT into matchmaking (user_id, game_id) select '{$_POST['user_id']}', '{$_POST['game_id']}' where not exists (select * from matchmaking where user_id = '{$_POST['user_id']}' and game_id = '{$_POST['game_id']}')");

                if ($query) {
                    echo 'OK';
                    exit;
                }
            }
            echo 'ERROR';
            break;
        
        case 'CheckRequest':
             if (isset($_POST['user_id']) && isset($_POST['game_id'])) {
                $query = pg_query($conn, "SELECT match_id from matchmaking where user_id = '{$_POST['user_id']}' and game_id = '{$_POST['game_id']}'");

                if ($query) {
                    $update_query = pg_query($conn, "UPDATE matchmaking set last_check = date_part('epoch'::text, now())::integer where user_id = '{$_POST['user_id']}' and game_id = '{$_POST['game_id']}'");
                    echo pg_fetch_row($query)[0];
                    exit;
                }
            }
            echo 'ERROR';
            break;

        // online game - user requests
        case 'GetMatchRules':
            if (isset($_POST['match_id']) && isset($_POST['user_id']))
                $query = pg_query($conn, "SELECT turn, game_id, current_number_lose, past_number_lose, max_score, (case when m.id_0 = '{$_POST['user_id']}' then 0 when m.id_1 = '{$_POST['user_id']}' then 1 end) as player_number, (case when m.id_0 = '{$_POST['user_id']}' then m.id_1 when m.id_1 = '{$_POST['user_id']}' then m.id_0 end) as opponent_id from (select * from matches where id = '{$_POST['match_id']}') as m join (select * from games) as g on g.id = m.game_id");

                if ($query) {
                    $rows = pg_fetch_all($query);
                    $res = array();

                    foreach ($rows as $row) {
                        $res[] = $row;
                    }
                    print json_encode($res);

                    $game_id = $res[0]['game_id'];
                    $update_query = pg_query($conn, "UPDATE games set total_played = total_played + 1, current_playing = current_playing + 1 where id='{$game_id}' ");
                    exit;
                }
            echo 'ERROR';
            break;

        case 'GetBotMatchRules':
            if (isset($_POST['game_id']))
            $query = pg_query($conn, "SELECT current_number_lose, past_number_lose, max_score from games where id='{$_POST['game_id']}'");

                if ($query) {
                    $rows = pg_fetch_all($query);
                    $res = array();

                    foreach ($rows as $row) {
                        $res[] = $row;
                    }
                    print json_encode($res);
                    exit;
                }
            echo 'ERROR';
            break;

        case 'GetMatchState':
            if (isset($_POST['match_id']))
                $query = pg_query($conn, "SELECT winner_id, dice_0, dice_1, score_0, total_score_0, score_1, total_score_1, turn, result_id from matches where id ='{$_POST['match_id']}'");

                if ($query) {
                    $rows = pg_fetch_all($query);
                    $res = array();

                    foreach ($rows as $row) {
                        $res[] = $row;
                    }
                    print json_encode($res);
                    exit;
                }
            echo 'ERROR';
            break;

        case 'UpdateMatchState':
            if (isset($_POST['match_id']) && isset($_POST['sname']) && isset($_POST['tsname']) && isset($_POST['current_score']) && isset($_POST['total_score']) && isset($_POST['turn']) && isset($_POST['dice_0']) && isset($_POST['dice_1']))
                $query = pg_query($conn, "UPDATE matches set {$_POST['sname']} = '{$_POST['current_score']}', {$_POST['tsname']} = '{$_POST['total_score']}', turn = '{$_POST['turn']}' where id ='{$_POST['match_id']}'");

                if ($_POST['dice_0'] >= 0 && $_POST['dice_1'] >= 0) {
                    $dice_query = pg_query($conn, "UPDATE matches set dice_0 = '{$_POST['dice_0']}', dice_1 = '{$_POST['dice_1']}' where id ='{$_POST['match_id']}'");
                }

                if ($query) {
                    echo 'OK';
                    exit;
                }
            echo 'ERROR';
            break;

        case 'UpdateMatchWinner':
            if (isset($_POST['match_id']) && isset($_POST['winner_id']) && isset($_POST['game_id']) && isset($_POST['left_id']) && isset($_POST['right_id'])) {
                $insert_query = pg_query($conn, "INSERT into games_results (left_id, right_id, winner_id, game_id) values('{$_POST['left_id']}', '{$_POST['right_id']}', '{$_POST['winner_id']}', '{$_POST['game_id']}') returning id");
                $result_id = pg_fetch_row($insert_query)[0];
                $query = pg_query($conn, "UPDATE matches set winner_id = '{$_POST['winner_id']}', result_id='{$result_id }' where id ='{$_POST['match_id']}'");
            
                if ($query) {
                    echo $result_id;
                    exit;
                }
            }
            echo 'ERROR';
            break;

        case 'GetResultId':
            if (isset($_POST['match_id'])) {
                $query = pg_query($conn, "SELECT result_id from matches where id ='{$_POST['match_id']}'");

                if ($query) {
                    $rows = pg_fetch_all($query);
                    $res = array();

                    foreach ($rows as $row) {
                        $res[] = $row;
                    }
                    print json_encode($res);
                    exit;
                }
            }
            echo 'ERROR';
            break;
    }
}

exit;
