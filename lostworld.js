// ===============================
// LOST WORLD GAME
// ===============================

const player = document.getElementById("player");
const treasure = document.getElementById("treasure");
const enemy = document.getElementById("enemy");
const obstacle = document.getElementById("obstacle");

const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const highScoreText = document.getElementById("highScore");
const levelText = document.getElementById("level");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const pauseScreen = document.getElementById("pauseScreen");
const countdown = document.getElementById("countdown");

const finalScore = document.getElementById("finalScore");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const jumpButton = document.getElementById("jumpButton");


// ===============================
// GAME VARIABLES
// ===============================

let playerX = 50;

let treasureY = -80;
let enemyY = -120;
let obstacleY = -180;

let treasureX = 30;
let enemyX = 65;
let obstacleX = 50;

let score = 0;
let lives = 3;
let level = 1;

let highScore = Number(localStorage.getItem("lostWorldHighScore")) || 0;

let gameRunning = false;
let paused = false;
let jumping = false;

let animationFrame;


// ===============================
// INITIAL DISPLAY
// ===============================

highScoreText.textContent = highScore;
scoreText.textContent = score;
livesText.textContent = lives;
levelText.textContent = level;


// ===============================
// PLAYER MOVEMENT
// ===============================

function moveLeft() {

    if (!gameRunning || paused) return;

    playerX -= 5;

    if (playerX < 8) {
        playerX = 8;
    }

    updatePlayerPosition();
}


function moveRight() {

    if (!gameRunning || paused) return;

    playerX += 5;

    if (playerX > 92) {
        playerX = 92;
    }

    updatePlayerPosition();
}


function updatePlayerPosition() {

    player.style.left = playerX + "%";
}


// ===============================
// JUMP
// ===============================

function jump() {

    if (!gameRunning || paused || jumping) return;

    jumping = true;

    player.style.bottom = "220px";

    setTimeout(function () {

        player.style.bottom = "125px";

        jumping = false;

    }, 650);
}


// ===============================
// KEYBOARD CONTROLS
// ===============================

document.addEventListener("keydown", function (event) {

    if (event.key === "ArrowLeft") {
        moveLeft();
    }

    if (event.key === "ArrowRight") {
        moveRight();
    }

    if (event.key === "ArrowUp" || event.key === " ") {
        event.preventDefault();
        jump();
    }

    if (event.key.toLowerCase() === "p") {
        togglePause();
    }

});


// ===============================
// MOBILE CONTROLS
// ===============================

leftButton.addEventListener("click", moveLeft);

rightButton.addEventListener("click", moveRight);

jumpButton.addEventListener("click", jump);


// ===============================
// TOUCH CONTROLS
// ===============================

leftButton.addEventListener("touchstart", function (event) {
    event.preventDefault();
    moveLeft();
});

rightButton.addEventListener("touchstart", function (event) {
    event.preventDefault();
    moveRight();
});

jumpButton.addEventListener("touchstart", function (event) {
    event.preventDefault();
    jump();
});


// ===============================
// RANDOM POSITION
// ===============================

function randomPosition() {

    return Math.floor(Math.random() * 80) + 10;

}


// ===============================
// RESET TREASURE
// ===============================

function resetTreasure() {

    treasureY = -80;

    treasureX = randomPosition();

    treasure.style.top = treasureY + "px";
    treasure.style.left = treasureX + "%";

}


// ===============================
// RESET ENEMY
// ===============================

function resetEnemy() {

    enemyY = -120;

    enemyX = randomPosition();

    enemy.style.top = enemyY + "px";
    enemy.style.left = enemyX + "%";

}


// ===============================
// RESET OBSTACLE
// ===============================

function resetObstacle() {

    obstacleY = -180;

    obstacleX = randomPosition();

    obstacle.style.top = obstacleY + "px";
    obstacle.style.left = obstacleX + "%";

}


// ===============================
// COLLISION DETECTION
// ===============================

function isColliding(element1, element2) {

    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );

}


// ===============================
// COLLECT TREASURE
// ===============================

function collectTreasure() {

    score += 5;

    scoreText.textContent = score;

    updateLevel();

    updateHighScore();

    resetTreasure();

}


// ===============================
// HIT ENEMY / ROCK
// ===============================

function loseLife() {

    lives--;

    livesText.textContent = lives;

    player.style.transform = "translateX(-50%) scale(1.3)";

    setTimeout(function () {
        player.style.transform = "translateX(-50%) scale(1)";
    }, 150);

    if (lives <= 0) {

        endGame();

    }

}


// ===============================
// LEVEL
// ===============================

function updateLevel() {

    level = Math.floor(score / 20) + 1;

    levelText.textContent = level;

}


// ===============================
// HIGH SCORE
// ===============================

function updateHighScore() {

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "lostWorldHighScore",
            highScore
        );

        highScoreText.textContent = highScore;

    }

}


// ===============================
// GAME UPDATE
// ===============================

function updateGame() {

    if (!gameRunning || paused) {
        return;
    }

    // Speed increases with level
    const speed = 3 + (level * 0.45);


    // Move treasure
    treasureY += speed;

    treasure.style.top = treasureY + "px";


    // Move enemy
    enemyY += speed + 0.8;

    enemy.style.top = enemyY + "px";


    // Move obstacle
    obstacleY += speed + 0.4;

    obstacle.style.top = obstacleY + "px";


    // Treasure reached bottom
    if (treasureY > 600) {

        resetTreasure();

    }


    // Enemy reached bottom
    if (enemyY > 600) {

        resetEnemy();

    }


    // Obstacle reached bottom
    if (obstacleY > 600) {

        resetObstacle();

    }


    // Treasure collision
    if (isColliding(player, treasure)) {

        collectTreasure();

    }


    // Enemy collision
    if (!jumping && isColliding(player, enemy)) {

        resetEnemy();

        loseLife();

    }


    // Rock collision
    if (!jumping && isColliding(player, obstacle)) {

        resetObstacle();

        loseLife();

    }

}


// ===============================
// GAME LOOP
// ===============================

function gameLoop() {

    if (!gameRunning) {
        return;
    }

    updateGame();

    animationFrame = requestAnimationFrame(gameLoop);

}


// ===============================
// COUNTDOWN
// ===============================

function startCountdown() {

    countdown.style.display = "flex";

    let count = 3;

    countdown.textContent = count;

    const timer = setInterval(function () {

        count--;

        if (count > 0) {

            countdown.textContent = count;

        } else {

            clearInterval(timer);

            countdown.textContent = "GO!";

            setTimeout(function () {

                countdown.style.display = "none";

                gameRunning = true;
                paused = false;

                gameLoop();

            }, 500);

        }

    }, 1000);

}


// ===============================
// START GAME
// ===============================

function startGame() {

    score = 0;
    lives = 3;
    level = 1;

    playerX = 50;

    scoreText.textContent = score;
    livesText.textContent = lives;
    levelText.textContent = level;

    gameOverScreen.style.display = "none";
    pauseScreen.style.display = "none";

    player.style.left = playerX + "%";
    player.style.bottom = "125px";

    resetTreasure();
    resetEnemy();
    resetObstacle();

    gameRunning = false;
    paused = false;
    jumping = false;

    startScreen.style.display = "none";

    cancelAnimationFrame(animationFrame);

    startCountdown();

}


// ===============================
// GAME OVER
// ===============================

function endGame() {

    gameRunning = false;

    cancelAnimationFrame(animationFrame);

    finalScore.textContent = score;

    gameOverScreen.style.display = "flex";

}


// ===============================
// PAUSE
// ===============================

function togglePause() {

    if (!gameRunning) return;

    paused = !paused;

    if (paused) {

        pauseScreen.style.display = "flex";

        pauseButton.textContent = "▶️ Resume";

    } else {

        pauseScreen.style.display = "none";

        pauseButton.textContent = "⏸️ Pause";

        gameLoop();

    }

}


// ===============================
// BUTTON EVENTS
// ===============================

startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", startGame);

pauseButton.addEventListener("click", togglePause);

resumeButton.addEventListener("click", togglePause);


// ===============================
// INITIAL GAME OBJECTS
// ===============================

resetTreasure();
resetEnemy();
resetObstacle();

updatePlayerPosition();