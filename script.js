const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const winScreen = document.getElementById("winScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const player = document.getElementById("player");
const partner = document.getElementById("partner");
const itemsContainer = document.getElementById("items");

const scoreText = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const loveBar = document.getElementById("loveBar");

const messageBox = document.getElementById("messageBox");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");

let playerX = 15;
let score = 0;
let love = 0;
let jumping = false;
let gameRunning = false;

const messages = [
    "Aku sayang kamu ❤️",
    "Jangan menyerah ya 💕",
    "Jarak bukan alasan untuk menyerah 🥹",
    "Tunggu aku ya 💌",
    "Kita pasti bertemu ❤️",
    "Aku selalu memikirkanmu 💗"
];

/* =========================
   START GAME
========================= */

startBtn.addEventListener("click", startGame);

function startGame() {

    startScreen.classList.remove("active");
    gameScreen.style.display = "block";

    resetGame();

    gameRunning = true;

    createItems();
}

/* =========================
   RESET
========================= */

function resetGame() {

    playerX = 15;
    score = 0;
    love = 0;

    scoreText.textContent = score;
    loveBar.style.width = "0%";

    player.style.left = playerX + "%";

    itemsContainer.innerHTML = "";

    winScreen.classList.remove("active");
}

/* =========================
   CREATE ITEMS
========================= */

function createItems() {

    const positions = [
        { x: 25, y: 60, type: "heart" },
        { x: 35, y: 40, type: "message" },
        { x: 47, y: 65, type: "heart" },
        { x: 58, y: 35, type: "heart" },
        { x: 68, y: 60, type: "message" },
        { x: 76, y: 40, type: "heart" }
    ];

    positions.forEach((itemData, index) => {

        const item = document.createElement("div");

        item.classList.add("item");
        item.classList.add(itemData.type);

        item.dataset.index = index;

        item.textContent =
            itemData.type === "heart"
                ? "❤️"
                : "💌";

        item.style.left = itemData.x + "%";
        item.style.top = itemData.y + "%";

        itemsContainer.appendChild(item);

    });
}

/* =========================
   MOVEMENT
========================= */

function moveLeft() {

    if (!gameRunning) return;

    playerX -= 3;

    if (playerX < 5) {
        playerX = 5;
    }

    player.style.left = playerX + "%";

    checkItems();
}

function moveRight() {

    if (!gameRunning) return;

    playerX += 3;

    if (playerX > 88) {
        playerX = 88;
    }

    player.style.left = playerX + "%";

    checkItems();

    if (playerX >= 82) {
        checkFinish();
    }
}

/* =========================
   KEYBOARD
========================= */

document.addEventListener("keydown", function(event) {

    if (!gameRunning) return;

    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        moveLeft();
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        moveRight();
    }

    if (event.key === "ArrowUp" || event.key === " ") {
        jump();
    }

});

/* =========================
   MOBILE BUTTON
========================= */

leftBtn.addEventListener("click", moveLeft);
rightBtn.addEventListener("click", moveRight);
jumpBtn.addEventListener("click", jump);

/* =========================
   JUMP
========================= */

function jump() {

    if (jumping || !gameRunning) return;

    jumping = true;

    player.style.transform = "translateY(-100px)";

    setTimeout(() => {

        player.style.transform = "translateY(0)";

        jumping = false;

        checkItems();

    }, 500);
}

/* =========================
   COLLECT ITEMS
========================= */

function checkItems() {

    const items = document.querySelectorAll(".item");

    items.forEach(item => {

        if (item.dataset.collected === "true") return;

        const itemX = parseFloat(item.style.left);

        if (Math.abs(playerX - itemX) < 5) {

            item.dataset.collected = "true";

            item.style.transform = "scale(2)";
            item.style.opacity = "0";

            setTimeout(() => {
                item.remove();
            }, 300);

            if (item.classList.contains("heart")) {

                score += 10;
                love += 15;

                showMessage("❤️ Love bertambah!");

            } else {

                score += 20;
                love += 20;

                const randomMessage =
                    messages[Math.floor(Math.random() * messages.length)];

                showMessage("💌 " + randomMessage);
            }

            if (love > 100) {
                love = 100;
            }

            scoreText.textContent = score;
            loveBar.style.width = love + "%";

        }

    });
}

/* =========================
   MESSAGE
========================= */

function showMessage(text) {

    messageBox.textContent = text;
    messageBox.classList.add("show");

    setTimeout(() => {
        messageBox.classList.remove("show");
    }, 1800);
}

/* =========================
   FINISH
========================= */

function checkFinish() {

    if (love < 60) {

        showMessage("💗 Kumpulkan lebih banyak cinta dulu!");

        return;
    }

    gameRunning = false;

    setTimeout(() => {

        gameScreen.style.display = "none";

        finalScore.textContent = score;

        winScreen.classList.add("active");

        createHearts();

    }, 500);
}

/* =========================
   CELEBRATION
========================= */

function createHearts() {

    for (let i = 0; i < 30; i++) {

        const heart = document.createElement("div");

        heart.textContent = "❤️";

        heart.style.position = "fixed";
        heart.style.left = Math.random() * 100 + "%";
        heart.style.top = Math.random() * 100 + "%";
        heart.style.fontSize = (15 + Math.random() * 30) + "px";
        heart.style.animation = "floating 1s infinite alternate";
        heart.style.zIndex = "200";

        winScreen.appendChild(heart);

    }

}

/* =========================
   RESTART
========================= */

restartBtn.addEventListener("click", function() {

    location.reload();

});