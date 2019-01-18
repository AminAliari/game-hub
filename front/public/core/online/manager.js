/*
    globals
*/
const url = 'https://game-hub-back.herokuapp.com/request.php'

const urlParams = new URLSearchParams(window.location.search);
const match_id = urlParams.get('match_id');
const user_id = urlParams.get('user_id')

var player_number = -1
var end_winner_id = -1
var game_id = -1

var current_scores = [0, 0]
var last_scores = [-1, -1, -1, -1] // p0 last of dice 0, p1 last of dice 0 and so on.
var total_scores = [0, 0]
var opponent_id = -1

var rules = {
    current_number_lose: 1,
    past_number_lose: 6,
    max_score: 100
}

var images = []
var dice_images = []
var turn = 0 // 0: p0, 1: p1

var is_paused = true

var get = (id) => {
    return document.getElementById(id)
}

// implementation
document.addEventListener('DOMContentLoaded', function () {
    GetGameRules()
    SetupUI()
    refresh()

}, false)

function GetGameRules() {
    $.post(url,
        {
            method: 'GetMatchRules',
            match_id: match_id,
            user_id: user_id
        }).done((data) => {
            var parsed = JSON.parse(data)[0]
            opponent_id = parsed.opponent_id
            game_id = parsed.game_id

            SetRules(parsed)
            turn = parsed.turn
            SetPlayerNumber(parsed.player_number)

            setInterval(FetchState, 1000);
            refresh()
            is_paused = false
        })
}

function SetupUI() {
    for (var i = 1; i <= 6; i++) {
        images[i] = `resources/images/dices/dice-${i}.png`
    }

    for (var i = 0; i < 2; i++) {
        dice_images[i] = get(`dice-${i}`)
    }
    dice_images[0].src = images[1]
    dice_images[1].src = images[1]

    var rollButton = get('roll-button')
    rollButton.onclick = (() => {
        if (is_paused || turn != player_number) return
        RollAndEval()
    })

    var holdButton = get('hold-button')
    holdButton.onclick = (() => {
        if (is_paused || turn != player_number) return
        HoldScore()
    })
}

function SetRules(parsed) {
    rules.current_number_lose = parsed.current_number_lose
    rules.past_number_lose = parsed.past_number_lose
    rules.max_score = parsed.max_score

    get('score-input').placeholder = 'max score: ' + rules.max_score
}

function SetPlayerNumber(number) {
    player_number = number
    get(`player-${player_number}-name`).innerText = '[You]'
}

function FetchState() {
    if (end_winner_id != -1) {
        if (result_id == -1) {
            $.post(url,
                {
                    method: 'GetResultId',
                    match_id: match_id
                }).done((data) => {
                    var parsed = JSON.parse(data)[0]
                    EndGame(parsed.result_id)
                })
        }
        return
    }

    if (turn != player_number) {
        is_paused = true
        $.post(url,
            {
                method: 'GetMatchState',
                match_id: match_id
            }).done((data) => {
                var parsed = JSON.parse(data)[0]

                if (parsed.winner_id != null) {
                    EndGame(parsed.result_id)
                    end_winner_id = parsed.winner_id
                } else {
                    dice_images[0].src = images[parsed.dice_0]
                    dice_images[1].src = images[parsed.dice_1]

                    current_scores[0] = parseInt(parsed.score_0)
                    total_scores[0] = parseInt(parsed.total_score_0)
                    current_scores[1] = parseInt(parsed.score_1)
                    total_scores[1] = parseInt(parsed.total_score_1)

                    turn = parsed.turn

                    refresh()
                    is_paused = false
                }
            })
    }
}

function RollAndEval() {
    var temp_score = [0, 0]
    temp_score[0] = GetRandomDice()
    temp_score[1] = GetRandomDice()

    dice_images[0].src = images[temp_score[0]]
    dice_images[1].src = images[temp_score[1]]

    if (CheckLoseTotalCondition(temp_score[0], temp_score[1])) {
        last_scores[turn] = last_scores[turn + 2] = -1

        UpdateState(0, 0, 1 - player_number, temp_score[0], temp_score[1]) // server

        UpdateCurrentScore(0)
        UpdateTotalScore(0)
        ChangeTurn()

    } else if (CheckLoseCurrentCondition(temp_score[0], temp_score[1])) {
        last_scores[turn] = last_scores[turn + 2] = -1

        UpdateState(0, total_scores[player_number], 1 - player_number, temp_score[0], temp_score[1]) // server

        UpdateCurrentScore(0)
        ChangeTurn()

    } else {
        last_scores[turn] = temp_score[0]
        last_scores[turn + 2] = temp_score[1]

        var new_score = current_scores[turn] + temp_score[0] + temp_score[1]
        UpdateState(new_score, total_scores[player_number], player_number, temp_score[0], temp_score[1]) // server

        UpdateCurrentScore(new_score)
    }
}

function UpdateState(r_current_score, r_total_score, r_turn, r_dice_0 = -1, r_dice_1 = -1) {
    is_paused = true

    $.post(url,
        {
            method: 'UpdateMatchState',
            match_id: match_id,
            sname: 'score_' + player_number,
            tsname: 'total_score_' + player_number,
            current_score: r_current_score,
            total_score: r_total_score,
            turn: r_turn,
            dice_0: r_dice_0,
            dice_1: r_dice_1

        }).done(() => {
            refresh()
            is_paused = false
        })
}

function UpdateWinnerState(r_winner_id) {
    is_paused = true

    $.post(url,
        {
            method: 'UpdateMatchWinner',
            match_id: match_id,
            left_id: player_number == 0 ? user_id : opponent_id,
            right_id: player_number == 0 ? opponent_id : user_id,
            game_id: game_id,
            winner_id: user_id

        }).done((data) => {
            EndGame(data)
        })
}

function CheckLoseCurrentCondition(s0, s1) {
    return s0 == rules.current_number_lose || s1 == rules.current_number_lose
}

function CheckLoseTotalCondition(s0, s1) {
    return (s0 == rules.past_number_lose || s1 == rules.past_number_lose) && (last_scores[turn] == rules.past_number_lose || last_scores[turn + 2] == rules.past_number_lose)
}

function GetRandomDice() {
    return Math.floor(Math.random() * 6 + 1)
}

function HoldScore() {
    var new_score = total_scores[turn] + current_scores[turn]

    UpdateState(0, new_score, 1 - player_number) // server

    UpdateTotalScore(new_score)
    UpdateCurrentScore(0)
    ChangeTurn()
}

function UpdateCurrentScore(score) {
    current_scores[turn] = score
    refresh()

    if (current_scores[turn] >= rules.max_score) {
        UpdateWinnerState(turn)
    }
}

function UpdateTotalScore(score) {
    total_scores[turn] = score

    if (total_scores[turn] >= rules.max_score) {
        UpdateWinnerState(turn)
    }
    refresh()
}

function ChangeTurn() {
    turn = 1 - turn;
    refresh();
}

function EndGame(result_id) {
    is_paused = true
    location.href = `/index/post-match/result_id=${result_id}&game_id=${game_id}&user_id=${user_id}&opponent_id=${opponent_id}`
}

function refresh() {
    for (var i = 0; i < 2; i++) {
        get(`score-${i}`).innerText = current_scores[i]
        get(`total-score-${i}`).innerText = total_scores[i]
        get(`turn-${i}`).setAttribute('style', `display: ${turn == i ? 'initial' : 'none'}`)
    }
}