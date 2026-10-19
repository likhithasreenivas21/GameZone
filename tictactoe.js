// ========================================
// TIC TAC TOE - GAMEZONE
// ========================================

// HTML ELEMENTS
const cells = document.querySelectorAll(".cell");

const gameMessage = document.getElementById("gameMessage");

const playerScoreText = document.getElementById("playerScore");
const computerScoreText = document.getElementById("computerScore");
const drawScoreText = document.getElementById("drawScore");

const resultBox = document.getElementById("resultBox");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");

const playAgainButton = document.getElementById("playAgainButton");
const restartButton = document.getElementById("restartButton");
const resetScoreButton = document.getElementById("resetScoreButton");
const backButton = document.getElementById("backButton");


// ========================================
// GAME VARIABLES
// ========================================

let board = ["", "", "", "", "", "", "", "", ""];

let playerTurn = true;
let gameFinished = false;

let playerScore =
    Number(localStorage.getItem("ticTacToePlayerScore")) || 0;

let computerScore =
    Number(localStorage.getItem("ticTacToeComputerScore")) || 0;

let drawScore =
    Number(localStorage.getItem("ticTacToeDrawScore")) || 0;


// ========================================
// WINNING COMBINATIONS
// ========================================

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];


// ========================================
// SCORE DISPLAY
// ========================================

function updateScore() {

    playerScoreText.textContent = playerScore;
    computerScoreText.textContent = computerScore;
    drawScoreText.textContent = drawScore;

}


// ========================================
// SAVE SCORE
// ========================================

function saveScore() {

    localStorage.setItem(
        "ticTacToePlayerScore",
        playerScore
    );

    localStorage.setItem(
        "ticTacToeComputerScore",
        computerScore
    );

    localStorage.setItem(
        "ticTacToeDrawScore",
        drawScore
    );

}


// ========================================
// CELL CLICK
// ========================================

cells.forEach(function(cell) {

    cell.addEventListener("click", function() {

        // Game already finished
        if (gameFinished) {
            return;
        }

        // Computer's turn
        if (!playerTurn) {
            return;
        }

        const index = Number(cell.dataset.index);

        // Already occupied
        if (board[index] !== "") {
            return;
        }

        // =================================
        // PLAYER MOVE
        // =================================

        board[index] = "X";

        cell.textContent = "❌";
        cell.classList.add("x");

        // Check result immediately
        const result = checkGameResult();

        if (result !== null) {

            finishGame(result);

            return;
        }

        // =================================
        // COMPUTER TURN
        // =================================

        playerTurn = false;

        gameMessage.textContent =
            "Computer is thinking... 🤖";

        setTimeout(function() {

            computerMove();

        }, 500);

    });

});


// ========================================
// COMPUTER MOVE
// ========================================

function computerMove() {

    if (gameFinished) {
        return;
    }

    // Find empty boxes
    const emptyCells = [];

    for (let i = 0; i < board.length; i++) {

        if (board[i] === "") {
            emptyCells.push(i);
        }

    }

    // No empty boxes
    if (emptyCells.length === 0) {

        finishGame("draw");

        return;
    }


    let selectedMove = -1;


    // 1. Try to WIN
    selectedMove = findWinningMove("O");


    // 2. Block PLAYER
    if (selectedMove === -1) {

        selectedMove = findWinningMove("X");

    }


    // 3. Take CENTER
    if (
        selectedMove === -1 &&
        board[4] === ""
    ) {

        selectedMove = 4;

    }


    // 4. Take CORNER
    if (selectedMove === -1) {

        const corners = [0, 2, 6, 8];

        const availableCorners =
            corners.filter(function(index) {

                return board[index] === "";

            });


        if (availableCorners.length > 0) {

            selectedMove =
                availableCorners[
                    Math.floor(
                        Math.random() *
                        availableCorners.length
                    )
                ];

        }

    }


    // 5. Take any empty box
    if (selectedMove === -1) {

        selectedMove =
            emptyCells[
                Math.floor(
                    Math.random() *
                    emptyCells.length
                )
            ];

    }


    // =================================
    // PLACE COMPUTER MOVE
    // =================================

    board[selectedMove] = "O";

    cells[selectedMove].textContent = "⭕";

    cells[selectedMove].classList.add("o");


    // Check result
    const result = checkGameResult();

    if (result !== null) {

        finishGame(result);

        return;
    }


    // Back to PLAYER
    playerTurn = true;

    gameMessage.textContent =
        "Your Turn! ❌";

}


// ========================================
// FIND WINNING MOVE
// ========================================

function findWinningMove(symbol) {

    for (let i = 0; i < board.length; i++) {

        if (board[i] !== "") {
            continue;
        }

        // Temporarily place symbol
        board[i] = symbol;

        const wins = checkWinner(symbol);

        // Remove temporary symbol
        board[i] = "";

        if (wins) {
            return i;
        }

    }

    return -1;

}


// ========================================
// CHECK WINNER
// ========================================

function checkWinner(symbol) {

    for (let i = 0; i < winningCombinations.length; i++) {

        const combination =
            winningCombinations[i];

        const a = combination[0];
        const b = combination[1];
        const c = combination[2];

        if (
            board[a] === symbol &&
            board[b] === symbol &&
            board[c] === symbol
        ) {

            return true;

        }

    }

    return false;

}


// ========================================
// CHECK GAME RESULT
// ========================================

function checkGameResult() {

    // Check WIN
    for (let i = 0; i < winningCombinations.length; i++) {

        const combination =
            winningCombinations[i];

        const a = combination[0];
        const b = combination[1];
        const c = combination[2];

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return {
                type: "win",
                symbol: board[a],
                combination: combination
            };

        }

    }


    // Check DRAW
    const boardFull =
        board.every(function(value) {

            return value !== "";

        });


    if (boardFull) {

        return {
            type: "draw"
        };

    }


    // Game continues
    return null;

}


// ========================================
// FINISH GAME
// ========================================

function finishGame(result) {

    gameFinished = true;


    // =================================
    // PLAYER WIN
    // =================================

    if (
        result.type === "win" &&
        result.symbol === "X"
    ) {

        playerScore++;

        saveScore();

        updateScore();

        gameMessage.textContent =
            "🎉 You Won!";

        resultTitle.textContent =
            "🏆 YOU WIN!";

        resultMessage.textContent =
            "Congratulations! You defeated the computer.";

        highlightWinner(
            result.combination
        );

    }


    // =================================
    // COMPUTER WIN
    // =================================

    else if (
        result.type === "win" &&
        result.symbol === "O"
    ) {

        computerScore++;

        saveScore();

        updateScore();

        gameMessage.textContent =
            "🤖 Computer Won!";

        resultTitle.textContent =
            "🤖 COMPUTER WINS";

        resultMessage.textContent =
            "Try again and defeat the computer!";

        highlightWinner(
            result.combination
        );

    }


    // =================================
    // DRAW
    // =================================

    else if (result.type === "draw") {

        drawScore++;

        saveScore();

        updateScore();

        gameMessage.textContent =
            "🤝 It's a Draw!";

        resultTitle.textContent =
            "🤝 DRAW";

        resultMessage.textContent =
            "Nobody won this round.";

    }


    // Show result
    resultBox.style.display = "block";

}


// ========================================
// HIGHLIGHT WINNING CELLS
// ========================================

function highlightWinner(combination) {

    combination.forEach(function(index) {

        cells[index].classList.add("winner");

    });

}


// ========================================
// RESET BOARD
// ========================================

function resetBoard() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];

    playerTurn = true;

    gameFinished = false;


    cells.forEach(function(cell) {

        cell.textContent = "";

        cell.classList.remove("x");
        cell.classList.remove("o");
        cell.classList.remove("winner");

    });


    resultBox.style.display = "none";

    gameMessage.textContent =
        "Your Turn! ❌";

}


// ========================================
// PLAY AGAIN
// ========================================

playAgainButton.addEventListener(
    "click",
    function() {

        resetBoard();

    }
);


// ========================================
// RESTART
// ========================================

restartButton.addEventListener(
    "click",
    function() {

        resetBoard();

    }
);


// ========================================
// RESET SCORE
// ========================================

resetScoreButton.addEventListener(
    "click",
    function() {

        const confirmReset =
            confirm(
                "Are you sure you want to reset all scores?"
            );


        if (!confirmReset) {
            return;
        }


        playerScore = 0;
        computerScore = 0;
        drawScore = 0;


        saveScore();

        updateScore();

        resetBoard();

    }
);


// ========================================
// BACK TO GAMEZONE
// ========================================

backButton.addEventListener(
    "click",
    function() {

        window.location.href =
            "index.html";

    }
);


// ========================================
// START
// ========================================

updateScore();

resetBoard();