let screen;
const screenWidth = 750;
const screenHeight = 250;
let context;

//player
const pWidth = 88;
const pHeight = 94;
const px = 50;
const py = screenHeight - pHeight;
let pImg;

let player = {
    x: px,
    y: py,
    width: pWidth,
    height: pHeight
}

//cactus
let cactusArray = [];

const catus1Width = 34;
const catus2Width = 69;
const catus3Width = 102;

const cactusHeight = 70;
const cactusX = 700;
const cactusY = screenHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -3; //cactus moving speed
let velocityY = 2;
let gravity = 0.15;

let gameOver = false;
let isRestarting = false;
let score = 0;


window.onload = function () {
    screen = document.getElementById('main-screen');
    screen.height = screenHeight;
    screen.width = screenWidth;
    context = screen.getContext('2d');

    //draw cat
    pImg = new Image();
    pImg.src = "./assets/cat1.png";
    pImg.onload = function () {
    }

    //draw cactus
    cactus1Img = new Image();
    cactus1Img.src = "./assets/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./assets/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./assets/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    document.addEventListener('keydown', moveCat);
    document.addEventListener('touchstart', moveCat);
    
    document.addEventListener('keydown', restartGame);
    document.addEventListener('click', restartGame);
    document.addEventListener('touchstart', restartGame);
}

function moveCat(e) {
    if (gameOver) return;

    if ((e.code == "Space" || e.code === "ArrowUp" || e.type === "touchstart") && player.y == py) {
        velocityY = -7;
    }

}

function update() {
    requestAnimationFrame(update);

    if (gameOver) return;

    context.clearRect(0, 0, screen.width, screen.height);

    //cat
    velocityY += gravity;
    player.y = Math.min(player.y + velocityY, py)
    context.drawImage(pImg, player.x, player.y, player.width, player.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);
        if (checkCollision(player, cactus)) {
            gameOver = true;
            pImg.src = "./assets/dead1.png";
            pImg.onload = function () {
                context.clearRect(0, 0, screen.width, screen.height);
                context.drawImage(pImg, player.x, player.y, player.width + 30, player.height);
            }
            isRestarting = true; // Allow restarting the game
            return;
        }
    }

    //score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function placeCactus() {

    if (gameOver) return;

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random();

    if (placeCactusChance > .90) { //10% chance of placing cactus3
        cactus.img = cactus3Img;
        cactus.width = catus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { //30% chance of placing cactus2
        cactus.img = cactus2Img;
        cactus.width = catus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { //50% chance of placing cactus1
        cactus.img = cactus1Img;
        cactus.width = catus1Width;
        cactusArray.push(cactus);
    }

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
        velocityY = 0;
        cactusArray = [];
        pImg.src = "./assets/cat1.png";
    }
}