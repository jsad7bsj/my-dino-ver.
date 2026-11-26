
const canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 300;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

let dino = {
    x: 70,
    y: 210,
    width: 35,
    height: 45,
    velocityY: 0,
    jumping: false
};

let ground = 255;
let gravity = 0.7;
let obstacles = [];
let score = 0;
let speed = 6;
let gameOver = false;

function jump() {
    if (!dino.jumping && !gameOver) {
        dino.velocityY = -13;
        dino.jumping = true;
    }

    if (gameOver) {
        location.reload();
    }
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
    }
});

function update() {
    if (gameOver) return;

    // Dino gravity
    dino.y += dino.velocityY;
    dino.velocityY += gravity;

    if (dino.y + dino.height >= ground) {
        dino.y = ground - dino.height;
        dino.velocityY = 0;
        dino.jumping = false;
    }

    // Create obstacles
    // Create obstacles with proper spacing
if (
    obstacles.length === 0 ||
    obstacles[obstacles.length - 1].x < canvas.width - 350
 ) {
    obstacles.push({
        x: canvas.width,
        y: ground - 35,
        width: 20,
        height: 35
    });
}

    // Move obstacles
    obstacles.forEach(obstacle => {
        obstacle.x -= speed;

        if (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y
        ) {
            gameOver = true;
        }
    });

    obstacles = obstacles.filter(o => o.x + o.width > 0);

    score += 0.1;
    speed += 0.00005;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = "#555";
    ctx.fillRect(0, ground, canvas.width, 3);

    //dino
    ctx.fillstyle = "#333";
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    // Obstacles
    ctx.fillStyle = "green";
    obstacles.forEach(o => {
        ctx.fillRect(o.x, o.y, o.width, o.height);
    });

    // Score
    ctx.fillStyle = "#333";
    ctx.font = "20px Arial";
    ctx.fillText("SCORE: " + Math.floor(score), 650, 35);

    // Game over
    if (gameOver) {
        ctx.font = "36px Arial";
        ctx.fillText("GAME OVER", 300, 130);
        ctx.font = "18px Arial";
        ctx.fillText("Press SPACE to restart", 300, 165);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
