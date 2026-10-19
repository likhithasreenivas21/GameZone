// ========================================
// MEMORY MATCH
// GAMEZONE
// ========================================


// ========================================
// HTML ELEMENTS
// ========================================

const cards =
    document.querySelectorAll(".card");

const scoreText =
    document.getElementById("score");

const timerText =
    document.getElementById("timer");

const movesText =
    document.getElementById("moves");

const bestScoreText =
    document.getElementById("bestScore");

const gameMessage =
    document.getElementById("gameMessage");

const resultBox =
    document.getElementById("resultBox");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const playAgainButton =
    document.getElementById("playAgainButton");

const restartButton =
    document.getElementById("restartButton");

const resetBestButton =
    document.getElementById("resetBestButton");

const backButton =
    document.getElementById("backButton");


// ========================================
// CARD SYMBOLS
// ========================================

const symbols = [
    "🍎",
    "🍌",
    "🍇",
    "🍉",
    "🍓",
    "🍒",
    "🥝",
    "🍍"
];


// ========================================
// GAME VARIABLES
// ========================================

let cardValues = [];

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let matchedPairs = 0;

let moves = 0;

let score = 0;

let timeLeft = 60;

let timerInterval = null;

let gameStarted = false;

let gameFinished = false;


// ========================================
// BEST SCORE
// ========================================

let bestScore =
    Number(
        localStorage.getItem(
            "memoryMatchBestScore"
        )
    ) || 0;


bestScoreText.textContent =
    bestScore;


// ========================================
// CREATE CARD VALUES
// ========================================

function createCardValues() {

    cardValues = [
        ...symbols,
        ...symbols
    ];

    shuffleCards();

}


// ========================================
// SHUFFLE
// ========================================

function shuffleCards() {

    for (
        let i = cardValues.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() * (i + 1)
            );


        const temp =
            cardValues[i];

        cardValues[i] =
            cardValues[randomIndex];

        cardValues[randomIndex] =
            temp;

    }

}


// ========================================
// SET CARD SYMBOLS
// ========================================

function setupCards() {

    cards.forEach(function(card, index) {

        const back =
            card.querySelector(".card-back");


        back.textContent =
            cardValues[index];


        card.classList.remove("flipped");

        card.classList.remove("matched");

    });

}


// ========================================
// CARD CLICK
// ========================================

cards.forEach(function(card, index) {

    card.addEventListener(
        "click",
        function() {

            handleCardClick(
                card,
                index
            );

        }
    );

});


// ========================================
// HANDLE CARD CLICK
// ========================================

function handleCardClick(card, index) {

    // Don't allow invalid clicks

    if (
        lockBoard ||
        gameFinished ||
        card.classList.contains("matched") ||
        card === firstCard
    ) {

        return;

    }


    // Start timer on first click

    if (!gameStarted) {

        startTimer();

        gameStarted = true;

        gameMessage.textContent =
            "Find the matching pairs! 🧠";

    }


    // Flip card

    card.classList.add("flipped");


    // First card

    if (firstCard === null) {

        firstCard = card;

        return;

    }


    // Second card

    secondCard = card;

    moves++;

    movesText.textContent =
        moves;


    checkMatch();

}


// ========================================
// CHECK MATCH
// ========================================

function checkMatch() {

    const firstIndex =
        Number(
            firstCard.dataset.card
        );

    const secondIndex =
        Number(
            secondCard.dataset.card
        );


    const firstSymbol =
        cardValues[firstIndex];

    const secondSymbol =
        cardValues[secondIndex];


    if (firstSymbol === secondSymbol) {

        matchedCards();

    } else {

        unflipCards();

    }

}


// ========================================
// MATCHED CARDS
// ========================================

function matchedCards() {

    firstCard.classList.add("matched");

    secondCard.classList.add("matched");


    matchedPairs++;

    
    // Score

    score += 10;

    scoreText.textContent =
        score;


    resetTurn();


    // Check all pairs

    if (matchedPairs === symbols.length) {

        winGame();

    }

}


// ========================================
// NOT MATCHED
// ========================================

function unflipCards() {

    lockBoard = true;


    setTimeout(function() {

        firstCard.classList.remove(
            "flipped"
        );

        secondCard.classList.remove(
            "flipped"
        );


        resetTurn();

    }, 700);

}


// ========================================
// RESET CURRENT TURN
// ========================================

function resetTurn() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


// ========================================
// TIMER
// ========================================

function startTimer() {

    clearInterval(timerInterval);


    timerInterval =
        setInterval(function() {

            timeLeft--;

            timerText.textContent =
                timeLeft;


            if (timeLeft <= 0) {

                clearInterval(
                    timerInterval
                );

                timeUp();

            }

        }, 1000);

}


// ========================================
// TIME UP
// ========================================

function timeUp() {

    gameFinished = true;

    lockBoard = true;


    gameMessage.textContent =
        "⏰ Time's Up!";


    resultTitle.textContent =
        "⏰ TIME'S UP";


    resultMessage.textContent =
        "You found " +
        matchedPairs +
        " out of " +
        symbols.length +
        " pairs.";


    resultBox.style.display =
        "block";

}


// ========================================
// WIN GAME
// ========================================

function winGame() {

    gameFinished = true;

    clearInterval(timerInterval);


    // Bonus for remaining time

    const timeBonus =
        timeLeft * 2;


    score += timeBonus;


    scoreText.textContent =
        score;


    // Bonus for fewer moves

    if (moves <= 12) {

        score += 30;

    } else if (moves <= 16) {

        score += 15;

    }


    scoreText.textContent =
        score;


    // Best score

    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "memoryMatchBestScore",
            bestScore
        );

        bestScoreText.textContent =
            bestScore;

    }


    gameMessage.textContent =
        "🎉 You found all pairs!";


    resultTitle.textContent =
        "🏆 YOU WIN!";


    resultMessage.textContent =
        "Score: " +
        score +
        " | Moves: " +
        moves;


    resultBox.style.display =
        "block";

}


// ========================================
// RESET GAME
// ========================================

function resetGame() {

    clearInterval(timerInterval);


    firstCard = null;

    secondCard = null;

    lockBoard = false;

    matchedPairs = 0;

    moves = 0;

    score = 0;

    timeLeft = 60;

    gameStarted = false;

    gameFinished = false;


    scoreText.textContent =
        "0";

    timerText.textContent =
        "60";

    movesText.textContent =
        "0";


    resultBox.style.display =
        "none";


    gameMessage.textContent =
        "Find the matching cards! 🧠";


    createCardValues();

    setupCards();

}


// ========================================
// PLAY AGAIN
// ========================================

playAgainButton.addEventListener(
    "click",
    function() {

        resetGame();

    }
);


// ========================================
// RESTART
// ========================================

restartButton.addEventListener(
    "click",
    function() {

        resetGame();

    }
);


// ========================================
// RESET BEST SCORE
// ========================================

resetBestButton.addEventListener(
    "click",
    function() {

        const confirmReset =
            confirm(
                "Reset your best score?"
            );


        if (!confirmReset) {

            return;

        }


        bestScore = 0;


        localStorage.removeItem(
            "memoryMatchBestScore"
        );


        bestScoreText.textContent =
            "0";

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
// START GAME
// ========================================

resetGame();