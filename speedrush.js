// ===============================
// SPEED RUSH - GAME JAVASCRIPT
// ===============================


// ---------- CAR ----------

const car = document.getElementById("playerCar");

let carPosition = 50;

document.addEventListener("keydown", function(event) {

    if (gameOver) return;

    if (event.key === "ArrowLeft") {
        carPosition -= 3;
    }

    if (event.key === "ArrowRight") {
        carPosition += 3;
    }

    // Keep car inside road
    if (carPosition < 15) {
        carPosition = 15;
    }

    if (carPosition > 85) {
        carPosition = 85;
    }

    car.style.left = carPosition + "%";

});


// ---------- SOUNDS ----------

const crashSound =
    document.getElementById("crashSound");

const coinSound =
    document.getElementById("coinSound");


// ---------- OBSTACLE ----------

const obstacle =
    document.getElementById("obstacle");

let obstacleTop = 20;

let obstaclePosition = 50;


// ---------- COIN ----------

const coin =
    document.getElementById("coin");

let coinTop = -60;

let speedBoost = false;

// ---------- SCORE ----------

let score = 0;

const scoreText =
    document.getElementById("score");


// ---------- LEVEL ----------

const levelText =
    document.getElementById("level");


// ---------- LIVES ----------

let lives = 3;

const livesText =
    document.getElementById("lives");

livesText.textContent = lives;


// ---------- HIGH SCORE ----------

let highScore =
    localStorage.getItem("speedRushHighScore") || 0;

const highScoreText =
    document.getElementById("highScore");

highScoreText.textContent = highScore;


// ---------- GAME STATUS ----------

const statusText =
    document.getElementById("gameStatus");


// ---------- GAME OVER ----------

let gameOver = false;

const gameOverScreen =
    document.getElementById("gameOverScreen");

const finalScore =
    document.getElementById("finalScore");

const lastScore =
    document.getElementById("lastScore");

const bestScore =
    document.getElementById("bestScore");

const playAgainButton =
    document.getElementById("playAgainButton");


// ---------- GAME START ----------

let gameStarted = false;

let gameLoop;


// =========================
// MOVE OBSTACLE + COIN
// =====================================

function moveObstacle() {

    if (gameOver) return;


    // ---------- SPEED ----------

    let speed = 4 + (score * 0.3);

    if (speedBoost) {
    speed += 3;
    }


    if (speed > 12) {
        speed = 12;
    }



    // ---------- MOVE OBSTACLE ----------

    obstacleTop += speed;

    obstacle.style.top =
        obstacleTop + "px";


    // ---------- MOVE COIN ----------

    coinTop += speed;

    coin.style.top =
        coinTop + "px";


    // ---------- GET POSITIONS ----------

    const carRect =
        car.getBoundingClientRect();

    const obstacleRect =
        obstacle.getBoundingClientRect();

    const coinRect =
        coin.getBoundingClientRect();


    // =================================
    // COIN COLLISION
    // =================================

    if (
        carRect.left < coinRect.right &&
        carRect.right > coinRect.left &&
        carRect.top < coinRect.bottom &&
        carRect.bottom > coinRect.top
    ) {

        // Add 5 points
        score += 5;

        statusText.textContent = "🚀 SPEED BOOST! +5";

        speedBoost = true;
       

        setTimeout(function() {
    speedBoost = false;
}, 2000);

        scoreText.textContent =
            score;


        // Play coin sound
        if (coinSound) {
            coinSound.currentTime = 0;
            coinSound.play().catch(() => {});
        }


        // Reset coin
        coinTop = -60;

        coin.style.top =
            coinTop + "px";


        // New random coin position
        coin.style.left =
            Math.floor(Math.random() * 70) + 15 + "%";


        
    }


    // =================================
    // OBSTACLE COLLISION
    // =================================

    if (
        obstacleTop >= 430 &&
        obstacleTop <= 520 &&
        Math.abs(carPosition - obstaclePosition) < 20
    ) {


        // Reduce life
        lives--;

        livesText.textContent ="❤️".repeat(lives);


        // =================================
        // GAME OVER ONLY WHEN LIVES = 0
        // =================================

        if (lives <= 0) {

            gameOver = true;


            // Crash animation
            document.body.style.animation =
                "crashShake 0.4s ease";


            // Stop game
            clearInterval(gameLoop);


            // Crash sound
            if (crashSound) {
                crashSound.currentTime = 0;
                crashSound.play().catch(() => {});
            }


            // Final score
            finalScore.textContent =
                score;


            // Save last score
            localStorage.setItem(
                "speedRushLastScore",
                score
            );


            // Last score
            lastScore.textContent =
                "🏆 Last Score: " + score;


            // Best score
            bestScore.textContent =
                "👑 Best Score: " + highScore;


            // Show Game Over
            gameOverScreen.style.display =
                "block";


            statusText.textContent =
                "💥 GAME OVER!";


            return;
        }


        // =================================
        // IF LIFE STILL REMAINS
        // =================================

        statusText.textContent =
            "💥 Crash! ❤️ Lives left: " + lives;


        // Reset obstacle
        obstacleTop = -60;


        // Move obstacle to new position
        obstaclePosition =
            Math.floor(Math.random() * 70) + 15;

        obstacle.style.left =
            obstaclePosition + "%";


        // New random obstacle
        const obstacles = [
            "🚧",
            "🛢️",
            "🚕",
            "🚙"
        ];

        obstacle.textContent =
            obstacles[
                Math.floor(
                    Math.random() * obstacles.length
                )
            ];
    }


    // =================================
    // OBSTACLE PASSED
    // =================================

    if (obstacleTop > 550) {

        score++;


        // ---------- LEVEL ----------

        let level =
            Math.floor(score / 5) + 1;

        levelText.textContent =
            level;


        // ---------- SCORE ----------

        scoreText.textContent =
            score;


        // ---------- HIGH SCORE ----------

        if (score > highScore) {

            highScore =
                score;

            highScoreText.textContent =
                highScore;


            localStorage.setItem(
                "speedRushHighScore",
                highScore
            );


            statusText.textContent =
                "👑 NEW HIGH SCORE!";
        }


        // ---------- RESET OBSTACLE ----------

        obstacleTop = -60;


        obstaclePosition =
            Math.floor(Math.random() * 70) + 15;


        obstacle.style.left =
            obstaclePosition + "%";


        // ---------- RANDOM OBSTACLE ----------

        const obstacles = [
            "🚧",
            "🛢️",
            "🚕",
            "🚙"
        ];


        obstacle.textContent =
            obstacles[
                Math.floor(
                    Math.random() * obstacles.length
                )
            ];
    }


    // =================================
    // RESET COIN
    // =================================

    if (coinTop > 550) {

        coinTop = -60;


        coin.style.top =
            coinTop + "px";


        coin.style.left =
            Math.floor(Math.random() * 70) + 15 + "%";
    }

}


// =====================================
// COUNTDOWN
// =====================================

function startCountdown() {

    const countdown =
        document.getElementById("countdown");

    let count = 3;


    countdown.textContent =
        count;


    const timer =
        setInterval(function() {

            count--;


            if (count > 0) {

                countdown.textContent =
                    count;

            }

            else {

                countdown.textContent =
                    "GO!";


                statusText.textContent =
                    "🏎️ GO! Keep Racing!";


                clearInterval(timer);


                setTimeout(function() {

                    countdown.textContent =
                        "";

                    startGame();

                }, 700);
            }

        }, 1000);

}


// =====================================
// START GAME
// =====================================

function startGame() {

    gameStarted = true;


    gameLoop =
        setInterval(
            moveObstacle,
            30
        );

}


// =====================================
// RESTART BUTTON
// =====================================

const restartButton =
    document.getElementById("restartButton");


restartButton.addEventListener(
    "click",
    function() {

        location.reload();

    }
);


// =====================================
// MOBILE LEFT BUTTON
// =====================================

const leftBtn =
    document.getElementById("leftBtn");


leftBtn.addEventListener(
    "mousedown",
    function() {

        if (gameOver) return;


        carPosition -= 3;


        if (carPosition < 15) {
            carPosition = 15;
        }


        car.style.left =
            carPosition + "%";

    }
);


leftBtn.addEventListener(
    "touchstart",
    function() {

        if (gameOver) return;


        carPosition -= 3;


        if (carPosition < 15) {
            carPosition = 15;
        }


        car.style.left =
            carPosition + "%";

    }
);


// =====================================
// MOBILE RIGHT BUTTON
// =====================================

const rightBtn =
    document.getElementById("rightBtn");


rightBtn.addEventListener(
    "mousedown",
    function() {

        if (gameOver) return;


        carPosition += 3;


        if (carPosition > 85) {
            carPosition = 85;
        }


        car.style.left =
            carPosition + "%";

    }
);


rightBtn.addEventListener(
    "touchstart",
    function() {

        if (gameOver) return;


        carPosition += 3;


        if (carPosition > 85) {
            carPosition = 85;
        }


        car.style.left =
            carPosition + "%";

    }
);


// =====================================
// START SCREEN
// =====================================

const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");


startButton.addEventListener(
    "click",
    function() {

        startScreen.style.display =
            "none";


        startCountdown();

    }
);


// =====================================
// PAUSE SYSTEM
// =====================================

const pauseButton =
    document.getElementById("pauseButton");

const pauseOverlay =
    document.getElementById("pauseOverlay");

let paused = false;


pauseButton.addEventListener(
    "click",
    function() {

        if (!gameStarted || gameOver) {
            return;
        }


        // ---------- PAUSE ----------

        if (!paused) {

            clearInterval(gameLoop);

            paused = true;


            pauseButton.textContent =
                "▶️ Resume";


            statusText.textContent =
                "⏸️ Game Paused";


            document.body.style.opacity =
                "0.85";


            pauseOverlay.style.display =
                "block";
        }


        // ---------- RESUME ----------

        else {

            gameLoop =
                setInterval(
                    moveObstacle,
                    30
                );


            paused = false;


            pauseButton.textContent =
                "⏸️ Pause";


            statusText.textContent =
                "🏎️ Keep Racing!";


            document.body.style.opacity =
                "1";


            pauseOverlay.style.display =
                "none";
        }

    }
);


// =====================================
// PLAY AGAIN
// =====================================

playAgainButton.addEventListener(
    "click",
    function() {

        location.reload();

    }
);