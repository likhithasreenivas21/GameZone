
// ================= GAME SEARCH & FILTER =================

const searchInput = document.getElementById("gameSearch");
const categoryButtons = document.querySelectorAll(".category-btn");
const gameCards = document.querySelectorAll(".game-card");

let selectedCategory = "all";


// Search

if (searchInput) {

    searchInput.addEventListener("input", filterGames);

}


// Category

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        filterGames();

    });

});


// Filter function

function filterGames() {

    const searchText = searchInput
    ? searchInput.value.toLowerCase()
    : "";


    gameCards.forEach(card => {

        const gameName =
            card.querySelector("h3").textContent.toLowerCase();

        const category =
            card.dataset.category;


        const matchesSearch =
            gameName.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;


        if (matchesSearch && matchesCategory) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });

}

// ================= THEME TOGGLE =================

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {
            themeToggle.textContent = "🌙";
        } else {
            themeToggle.textContent = "☀️";
        }

    });

}
// ================= LOGIN POPUP =================

const loginButton = document.querySelector(".login-btn");
const loginOverlay = document.getElementById("loginOverlay");
const closeLogin = document.getElementById("closeLogin");
const loginSubmit = document.getElementById("loginSubmit");
const loginMessage = document.getElementById("loginMessage");

if (loginButton && loginOverlay) {

    loginButton.addEventListener("click", () => {
        loginOverlay.classList.add("show");
    });

}

if (closeLogin && loginOverlay) {

    closeLogin.addEventListener("click", () => {
        loginOverlay.classList.remove("show");
    });

}

if (loginSubmit) {

    loginSubmit.addEventListener("click", () => {

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value.trim();

        if (username === "" || password === "") {

            loginMessage.textContent =
                "⚠️ Please enter username and password.";

            return;
        }

        loginMessage.textContent =
            "🎉 Login successful!";

    });

}


// ================= LEADERBOARD RANKING =================

const leaderboardBox =
    document.getElementById("leaderboardBox");

if (leaderboardBox) {

    const playerScore =
        (Number(localStorage.getItem("wins")) || 0) * 1000;

    const currentPlayer =
        document.getElementById("currentPlayer");

    const playerScoreElement =
        document.getElementById("playerScore");

    playerScoreElement.textContent = playerScore;

    currentPlayer.dataset.score = playerScore;


    // Get all players

    const players =
        Array.from(
            leaderboardBox.querySelectorAll(".player")
        );


    // Sort by score

    players.sort((a, b) => {

        return Number(b.dataset.score) -
               Number(a.dataset.score);

    });


    // Rebuild leaderboard

    players.forEach((player, index) => {

        const name =
            player.querySelector("span");

        if (index === 0) {
            name.textContent = "🥇 " +
                name.textContent.replace(/[🥇🥈🥉]/g, "").trim();
        }

        else if (index === 1) {
            name.textContent = "🥈 " +
                name.textContent.replace(/[🥇🥈🥉]/g, "").trim();
        }

        else if (index === 2) {
            name.textContent = "🥉 " +
                name.textContent.replace(/[🥇🥈🥉]/g, "").trim();
        }

        leaderboardBox.appendChild(player);

    });

}

// ================= CONTACT FORM =================

const contactForm =
    document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("contactName").value.trim();

        const email =
            document.getElementById("contactEmail").value.trim();

        const message =
            document.getElementById("contactMessage").value.trim();

        const status =
            document.getElementById("contactStatus");


        if (name === "" || email === "" || message === "") {

            status.textContent =
                "⚠️ Please fill all fields.";

            return;
        }


        status.textContent =
            "✅ Message sent successfully!";

        contactForm.reset();

    });

}

// ================= LOADING SCREEN =================

const loader = document.getElementById("loader");

if (loader) {

    window.addEventListener("load", () => {

        setTimeout(() => {

            loader.classList.add("hide");

        }, 1200);

    });

}

// ================= SCROLL REVEAL =================

const revealElements =
    document.querySelectorAll(".scroll-reveal");

const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    },
    {
        threshold: 0.15
    }
);

revealElements.forEach(element => {
    revealObserver.observe(element);
});


// ================= MOBILE MENU =================

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("mobile-show");

    });

}

// ================= CLOSE MOBILE MENU =================

const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        if (navLinks) {
            navLinks.classList.remove("mobile-show");
        }

    });

});

// ================= BACK TO TOP =================

const backToTop =
    document.getElementById("backToTop");

if (backToTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    });


    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

// ========================================
// GAME OF THE WEEK
// ========================================

// All GameZone games

const gameList = {

    "tictactoe.html": {
        name: "⭕ Tic Tac Toe",
        key: "tictactoe"
    },

    "speedrush.html": {
        name: "🚗 Speed Rush",
        key: "speedrush"
    },

    "lostworld.html": {
        name: "🌍 Lost World",
        key: "lostworld"
    },

    "memorymatch.html": {
        name: "🧠 Memory Match",
        key: "memorymatch"
    }

};


// ========================================
// GET CURRENT WEEK
// ========================================

function getCurrentWeek() {

    const today = new Date();

    // Find Monday of current week

    const day =
        today.getDay();

    const difference =
        day === 0 ? -6 : 1 - day;

    const monday =
        new Date(today);

    monday.setDate(
        today.getDate() + difference
    );

    monday.setHours(
        0,
        0,
        0,
        0
    );

    return monday
        .toISOString()
        .split("T")[0];

}


// ========================================
// WEEKLY STORAGE KEY
// ========================================

function getWeeklyStorageKey() {

    return "gameZonePlays_" +
        getCurrentWeek();

}


// ========================================
// GET PLAY COUNTS
// ========================================

function getPlayCounts() {

    const key =
        getWeeklyStorageKey();

    const saved =
        localStorage.getItem(key);

    if (saved) {

        return JSON.parse(saved);

    }


    return {
        tictactoe: 0,
        speedrush: 0,
        lostworld: 0,
        memorymatch: 0
    };

}


// ========================================
// SAVE PLAY COUNTS
// ========================================

function savePlayCounts(counts) {

    localStorage.setItem(
        getWeeklyStorageKey(),
        JSON.stringify(counts)
    );

}


// ========================================
// COUNT GAME PLAY
// ========================================

function countGamePlay(gameKey) {

    const counts =
        getPlayCounts();


    if (
        counts[gameKey] === undefined
    ) {

        counts[gameKey] = 0;

    }


    counts[gameKey]++;


    savePlayCounts(counts);

}


// ========================================
// ADD PLAY COUNT TO GAME LINKS
// ========================================

function setupGamePlayTracking() {

    const gameLinks =
        document.querySelectorAll(
            'a[href$=".html"]'
        );


    gameLinks.forEach(function(link) {

        const href =
            link.getAttribute("href");


        if (
            !gameList[href]
        ) {

            return;

        }


        link.addEventListener(
            "click",
            function() {

                const game =
                    gameList[href];


                countGamePlay(
                    game.key
                );

            }
        );

    });

}


// ========================================
// FIND GAME OF THE WEEK
// ========================================

function getGameOfTheWeek() {

    const counts =
        getPlayCounts();


    let highestGame =
        "tictactoe";


    let highestCount =
        counts.tictactoe;


    Object.keys(counts).forEach(
        function(gameKey) {

            if (
                counts[gameKey] >
                highestCount
            ) {

                highestCount =
                    counts[gameKey];

                highestGame =
                    gameKey;

            }

        }
    );


    return {
        key: highestGame,
        plays: highestCount
    };

}


// ========================================
// UPDATE FEATURED SECTION
// ========================================

function updateFeaturedGame() {

    const featuredName =
        document.getElementById(
            "featuredGameName"
        );

    const featuredPlays =
        document.getElementById(
            "featuredGamePlays"
        );

    const featuredButton =
        document.getElementById(
            "featuredPlayButton"
        );


    if (
        !featuredName ||
        !featuredPlays ||
        !featuredButton
    ) {

        return;

    }


    const featured =
        getGameOfTheWeek();


    let gameInfo = null;


    Object.keys(gameList).forEach(
        function(filename) {

            if (
                gameList[filename].key ===
                featured.key
            ) {

                gameInfo =
                    gameList[filename];

            }

        }
    );


    if (!gameInfo) {

        return;

    }


    featuredName.textContent =
        gameInfo.name;


    featuredPlays.textContent =
        "🔥 " +
        featured.plays +
        " plays this week";


    // Set Play Now link

    Object.keys(gameList).forEach(
        function(filename) {

            if (
                gameList[filename].key ===
                featured.key
            ) {

                featuredButton.href =
                    filename;

            }

        }
    );

}


// ========================================
// START GAME OF THE WEEK SYSTEM
// ========================================

setupGamePlayTracking();

updateFeaturedGame();