-- trigger for game scores
CREATE OR REPLACE FUNCTION process_game_score() RETURNS TRIGGER AS $process_game_score$
    BEGIN
        WITH RES as
        (
            SELECT game_id, avg(score) as avg_score from games_comments group by game_id
        )
        UPDATE games set score = RES.avg_score from RESwhere id = RES.game_id;
        RETURN NULL;
    END;
$process_game_score$ LANGUAGE plpgsql;

create trigger game_score_trigger after insert or update or delete on games_comments for each row execute procedure process_game_score();

-- trigger for users scores
CREATE OR REPLACE FUNCTION process_user_score() RETURNS TRIGGER AS $process_user_score$
    BEGIN
        WITH RES as
        (
            SELECT user_id, avg(score) as avg_score from users_comments group by user_id
        )
        UPDATE users set score = RES.avg_score from RES where id = RES.user_id;
        RETURN NULL;
    END;
$process_user_score$ LANGUAGE plpgsql;

create trigger user_score_trigger after insert or update or delete on users_comments for each row execute procedure process_user_score();