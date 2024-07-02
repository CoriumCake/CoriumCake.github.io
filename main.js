let screen;
const screenWidth = 750;
const screenHeight = 250;
let context;

// Player
const pWidth = 88;
const pHeight = 94;
const px = 50;
const py = screenHeight - pHeight;
let pImg;

const hitboxWidth = 60;
const hitboxHeight = 80;
const hitboxOffsetX = (pWidth - hitboxWidth) / 2;
const hitboxOffsetY = (pHeight - hitboxHeight) / 2;

let player = {
    x: px,
    y: py,
    width: pWidth,
    height: pHeight,
    hitbox: {
        x: px + hitboxOffsetX,
        y: py + hitboxOffsetY,
        width: hitboxWidth,
        height: hitboxHeight
    }
};

// Cactus
let cactusArray = [];
const cactusWidth = [34, 69, 102];
const cactusHeight = 70;
const cactusX = screenWidth;
const cactusY = screenHeight - cactusHeight;

let cactusImg = [];
let gameOver = false;
let isRestarting = false;
let score = 0;

// Physics
let velocityX = -3;
let velocityY = 0;
let gravity = 0.15;

// Sound
let audioContext;
let jumpSoundBuffer;
let deathSoundBuffer;

window.onload = function () {
    screen = document.getElementById('main-screen');
    screen.height = screenHeight;
    screen.width = screenWidth;
    context = screen.getContext('2d');

    // Load images
    pImg = loadImage("./assets/cat1.png");

    cactusImg[0] = loadImage("./assets/cactus1.png");
    cactusImg[1] = loadImage("./assets/cactus2.png");
    cactusImg[2] = loadImage("./assets/cactus3.png");

    // Load sounds
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    loadSound('./assets/jump.mp3', function(buffer) {
        jumpSoundBuffer = buffer;
    });
    loadSound('./assets/death.mp3', function(buffer) {
        deathSoundBuffer = buffer;
    });

    // Start game
    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    document.addEventListener('keydown', moveCat);
    document.addEventListener('touchstart', moveCat);
    document.addEventListener('keydown', restartGame);
    document.addEventListener('click', restartGame);
    document.addEventListener('touchstart', restartGame);
};

function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

function loadSound(url, callback) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
            callback(buffer);
        });
    };
    request.send();
}

function playSound(buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
}

function moveCat(e) {
    if (gameOver) return;

    if ((e.code == "Space" || e.code === "ArrowUp" || e.type === "touchstart") && player.y == py) {
        velocityY = -7;
        playSound(jumpSoundBuffer);
    }
}

function update() {
    if (!gameOver) {
        requestAnimationFrame(update);
    }

    context.clearRect(0, 0, screen.width, screen.height);

    // Update player position
    velocityY += gravity;
    player.y = Math.min(player.y + velocityY, py);
    player.hitbox.y = player.y + hitboxOffsetY;

    // Draw player
    context.drawImage(pImg, player.x, player.y, player.width, player.height);

    // Update and draw cacti
    for (let i = cactusArray.length - 1; i >= 0; i--) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        if (cactus.x + cactus.width < 0) {
            cactusArray.splice(i, 1);
            continue;
        }
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (checkCollision(player.hitbox, cactus)) {
            gameOver = true;
            playSound(deathSoundBuffer); // Play death sound
            pImg.src = "./assets/dead1.png";
            pImg.onload = function () {
                context.clearRect(0, 0, screen.width, screen.height);
                context.drawImage(pImg, player.x, player.y, player.width, player.height);
            };
            isRestarting = true;
            return;
        }
    }

    // Draw score
    context.fillStyle = "black";
    context.font = "20px courier";
    context.fillText(score, 5, 20);
    score++;
}

function placeCactus() {
    if (gameOver) return;

    let cactusIndex = Math.floor(Math.random() * 3);
    let cactus = {
        img: cactusImg[cactusIndex],
        x: cactusX,
        y: cactusY,
        width: cactusWidth[cactusIndex],
        height: cactusHeight
    };
    
    cactusArray.push(cactus);

    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}

function checkCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function restartGame(e) {
    if (isRestarting) {
        isRestarting = false;
        gameOver = false;
        score = 0;
        player.y = py;
        player.hitbox.y = py + hitboxOffsetY;
        velocityY = 0;
        cactusArray = [];
        pImg.src = "./assets/cat1.png";
        requestAnimationFrame(update);
    }
}
