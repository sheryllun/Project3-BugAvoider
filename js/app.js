//Arrays of starting positions and speeds
var enemyY = [60,145,230];
var enemySpeed = [30,100,170,250,320,500];
var playerX = [100,200,300,400];
var playerY = [300,400];

// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    //The following tracks the position of our enemies.
    this.x = this.startPosX();
    this.y = this.startPosY();
}

//Randomize the initial X and Y-value starting positions
Enemy.prototype.startPosX = function() {
    var startX = -(Math.round(Math.random()*400));
    return startX;
}

Enemy.prototype.startPosY = function() {
    var startY = enemyY[Math.round(Math.random()*2)];
    return startY;
}

// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += enemySpeed[Math.round(Math.random()*5)]*dt;
    //If our enemies move off the screen, restart them again at the beginning.
    if(this.x > 500) {
        this.x = this.startPosX();
        this.y = this.startPosY();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var pImages = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];

// Now write your own player class
var Player = function() {
    //pick a random character image
    this.sprite = pImages[Math.floor(Math.random()*5)];
    this.x = this.startPosX();
    this.y = this.startPosY();
}

Player.prototype.startPosX = function () {
    var startX = playerX[Math.round(Math.random()*3)];
    return startX;
}

Player.prototype.startPosY = function() {
    var startY = playerY[Math.round(Math.random())];
    return startY;
}

Player.prototype.update = function(dt) {
    this.x*dt;
    this.y*dt;
}

Player.prototype.reset = function() {
    this.x = this.startPosX();
    this.y = this.startPosY();
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function (num) {
    //if statements prevent our player from falling off the game board.
    switch(num) {
        case 'left':
            if(this.x > 15)
            this.x-=100;
            break;
        case 'up':
            if(this.y > -5)
            this.y-=90;
            break;
        case 'right':
            if(this.x < 400)
            this.x+=100;
            break;
        case 'down':
            if(this.y < 375)
            this.y+=90;
            break;
        default:
            return;
    }
}
//create a new class to track number of lives per player.
var Life = function() {
    this.lifeImg = 'images/Heartsmall.png';
    this.number = 3;
}

//draws the hearts for each life.
Life.prototype.render = function() {
    var imgX = 0;
    for(x = 0; x < this.number; x++) {
        ctx.drawImage(Resources.get(this.lifeImg), imgX, 0);
        imgX +=30;
    }
    if(this.number == 0) {
        gameOver();
    }
}

Life.prototype.loseLife = function () {
    if(this.number > 0) this.number--;
}

// Now instantiate your objects.
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var enemy4 = new Enemy();
var enemy5 = new Enemy();
var allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5];
var player = new Player();
var roundLife = new Life();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//disables arrow keys from scrolling window in game.
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function resetGame() {
    player.reset();
    for(var j in allEnemies) {
        allEnemies[j].x = allEnemies[j].startPosX();
        allEnemies[j].y = allEnemies[j].startPosY();
    }
}

//Check for collisions.  Reset game and lose a life if this happens.
function checkCollisions(enemy, player) { 
    for(var i in enemy) {
      if((player.x - enemy[i].x < 50 && player.y - enemy[i].y < 50) && (player.x - enemy[i].x > -50 && player.y - enemy[i].y > -50)) {
        resetGame();
        roundLife.loseLife();
        }
    }   
}

var score = 0;
//If player reaches the water, reset the game, increase score.
function winGame() {
    document.getElementById('score').innerHTML = "Score: "+score;
    if(player.y < 0) {
        score++;
        player.reset();
    }
}

function gameOver() {
    var removeScore = document.getElementById('score');
        removeScore.parentNode.removeChild(removeScore);
        timer = document.getElementById('timer');
        timer.parentNode.removeChild(timer);
        ctx.clearRect(0,0, 505, 680);
        ctx.fillStyle="#FF0000";
        ctx.font = "50px Roboto Condensed";
        ctx.fillStyle="#000000";
        ctx.fillText("Game Over!", 150, 100);
        ctx.font="30px Roboto Condensed";
        ctx.fillText("Your final score is " + score, 150, 150);
}

//Create a 30-second timed game

var timer;
var totalSeconds;

function createTimer(TimerID, Time) {
    timer = document.getElementById(TimerID);
    totalSeconds = Time;
    updateTimer();
    window.setTimeout("Tick()", 1000);
}

function Tick() {
    if(totalSeconds <= 0) {
        return gameOver();
    }
    totalSeconds --;
    updateTimer();
    window.setTimeout("Tick()", 1000);
}

function updateTimer() {
    var seconds = totalSeconds
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * (60);

    var timeStr = LeadingZero(minutes) + ":" + LeadingZero(seconds);

    timer.innerHTML = timeStr;
}

function LeadingZero(Time) {
    return (Time < 10) ? "0" + Time : + Time;
}
