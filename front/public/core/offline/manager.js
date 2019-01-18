/*
    globals
*/
const url = 'https://game-hub-back.herokuapp.com/request.php'

const urlParams = new URLSearchParams(window.location.search);
const game_id = urlParams.get('game_id');

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
            method: 'GetBotMatchRules',
            game_id: game_id
        }).done((data) => {
            var parsed = JSON.parse(data)[0]

            SetRules(parsed)
            turn = 0

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
        if (is_paused || turn != 0) return
        RollAndEval()
    })

    var holdButton = get('hold-button')
    holdButton.onclick = (() => {
        if (is_paused || turn != 0) return
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


function RollAndEval() {
    var temp_score = [0, 0]
    temp_score[0] = GetRandomDice()
    temp_score[1] = GetRandomDice()

    dice_images[0].src = images[temp_score[0]]
    dice_images[1].src = images[temp_score[1]]

    if (CheckLoseTotalCondition(temp_score[0], temp_score[1])) {
        last_scores[turn] = last_scores[turn + 2] = -1

        UpdateCurrentScore(0)
        UpdateTotalScore(0)
        ChangeTurn()

    } else if (CheckLoseCurrentCondition(temp_score[0], temp_score[1])) {
        last_scores[turn] = last_scores[turn + 2] = -1

        UpdateCurrentScore(0)
        ChangeTurn()

    } else {
        last_scores[turn] = temp_score[0]
        last_scores[turn + 2] = temp_score[1]

        var new_score = current_scores[turn] + temp_score[0] + temp_score[1]
        UpdateCurrentScore(new_score)
    }
    refresh()
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


    if (turn == 1) {
        setTimeout(ThinkAI, 500)
    }
}

function ThinkAI() {
    RollAndEval()
    if (current_scores[1] != 0) {
        if (Math.random() > 0.5) {
            setTimeout(ThinkAI, 500)
        } else {
            setTimeout(HoldScore, 500)
        }
    }
}

function EndGame() {
    is_paused = true
    var end_text = turn == 0 ? 'You have won' : 'Bot won you!'
    alert(end_text)
}

function refresh() {
    for (var i = 0; i < 2; i++) {
        get(`score-${i}`).innerText = current_scores[i]
        get(`total-score-${i}`).innerText = total_scores[i]
        get(`turn-${i}`).setAttribute('style', `display: ${turn == i ? 'initial' : 'none'}`)
    }
}