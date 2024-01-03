var canvas = document.getElementById("myCanvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

var bulletAudio = new Audio("../mp3/bullet.mp3");
var itemAudio = new Audio("../mp3/item.mp3");
var touchAudio = new Audio("../mp3/touch.mp3");
var gameOverAudio = new Audio("../mp3/gameover.mp3");
var winAudio = new Audio("../mp3/win.mp3");

const ballSpeed = 0.5; 
const ballSpeedMax = 1.4; 
const ballSpin = 0.2; 
const numBrickCol = 9 ; 
const brickGap = 0.3;
const numBrickRow = 5;
const gameLives = 3;
const marginBrick = 6; 
const maxLevel = 9; 
var paddleSize = 1.7;
var paddleSpeed = 0.5; 
var paddleWidth = 0.18 ; 

const itemBonus = 50; 
const itemChance = 0.2;
const itemSpeed = 0.15;

const WALL = 0.02;

const COLOR_BACKGROUND = "black";
var COLOR_BALL = localStorage.getItem("ballColor");
const COLOR_PADDLE = "white";
const COLOR_TEXT = "red";
const COLOR_WALL = "grey";

const TEXT_FONT = "Nova Square";
const TEXT_GAME_OVER = "GAME OVER";
const TEXT_LEVEL = "Level";
const TEXT_LIVES = "Live";
const TEXT_SCORE = "Score";
const TEXT_WIN = "!!! YOU WIN !!!";
const PARTICLE_SIZE = 5;
const PARTICLE_CHANGE_SIZE_SPEED = 0.07;
const PARTICLE_CHANGE_SPEED = 0.5;
const ACCELEBRATION = 0.12;
const DOT_CHANGE_SIZE_SPEED = 0.2;
const DOT_CHANGE_ALPHA_SPEED = 0.07;
const PARTICLE_MIN_SPEED = 8;
const NUMBER_PARTICLE_PER_BULLET = 20;

const Direction = {
    LEFT: 0,
    RIGHT: 1,
    STOP: 2
}

const itemType = {
    EXTENSION: {color: "dodgerblue", symbol: "E"}, 
    MINISIZE: {color: "aqua", symbol: "M"}, 
    LIFE: {color: "hotpink", symbol: "+"},
    DIE: {color: "pink", symbol: "-"},
    STICKY: {color: "forestgreen", symbol: "~"},
    SUPER: {color: "magenta", symbol: "P"},
    LONG: {color: "darkgreen", symbol: "L"},
    SHORT: {color: "greenyellow", symbol: "S"},
    SHOOT: {color: "deeppink", symbol: "O"},
    FAST: {color: "gold", symbol:"F"},
    SLOW: {color: "khaki", symbol:"W"},
    X3: {color: "purple", symbol:"3"}
}

var GAME_HEIGHT, GAME_WIDTH, wall;
var balls = [], shadows = [], bricks = [], changeToBrick, paddle = new Paddle(), items = [], bulletLeft = [], bulletRight = [];
var gameOver, win, isBoss, itemExtension, itemSticky, itemSuper, itemMini, itemLong, itemShort, itemShoot, itemFast, itemSlow, itemX3;
var level, level1_9, lives, score, numBalls;
var numBricks, textSize, touchX;
var minAngle = 25  / 180 * Math.PI;
var timeDelta, timeLast;
var timeOutExtension, timeOutSticky, timeOutSuper, timeOutMini, timeOutLong, timeOutShort, timeOutShoot, timeOutFast, timeOutSlow; 
var mousePos = {x:0, y:0}, saveBallMini = {dx:0, dy:0};
var delta = 0.02;

class particle{
    constructor(bullet, deg){
        this.bullet = bullet;
        this.ctx = bullet.ctx;
        this.deg = deg;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.color = this.bullet.color;
        this.size = PARTICLE_SIZE;
        this.speed = Math.random() * 4 + PARTICLE_MIN_SPEED;
        this.speedX = 0;
        this.speedY = 0;
        this.fallSpeed = 0;

        this.dots = [];
    }

    update(){
        this.speed -= PARTICLE_CHANGE_SPEED;
        if (this.speed < 0) {
            this.speed = 0;
        }

        this.fallSpeed += ACCELEBRATION;

        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg) + this.fallSpeed;

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > PARTICLE_CHANGE_SIZE_SPEED) {
            this.size -= PARTICLE_CHANGE_SIZE_SPEED;
        }

        if (this.size > 0){
            this.dots.push({
                x: this.x,
                y: this.y,
                alpha: 1,
                size: this.size
            });
        }

        this.dots.forEach(dot => {
            dot.size -= DOT_CHANGE_SIZE_SPEED;
            dot.alpha -= DOT_CHANGE_ALPHA_SPEED;
        });

        this.dots = this.dots.filter( dot => {
            return dot.size > 0;
        });

        if (this.dots.length == 0) {
            this.remove();
        }
    }

    remove(){
        this.bullet.particles.splice(this.bullet.particles.indexOf(this), 1);
    }

    draw(){
        this.dots.forEach( dot => {
            this.ctx.fillStyle = 'rgba('+this.color+',1)';
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2*Math.PI);
            this.ctx.fill();
        });
    }
}

class bulletFire{
    constructor(fireworks){
        this.fireworks = fireworks;
        this.ctx = fireworks.ctx;
        this.x = Math.random() * GAME_WIDTH;
        this.y = Math.random() * GAME_HEIGHT / 3 * 2;
        this.color = Math.floor(Math.random() * 255) + ',' +
                    Math.floor(Math.random() * 255) + ',' +
                    Math.floor(Math.random() * 255);

        this.particles = [];
        
        let bulletDeg = Math.PI *2 /NUMBER_PARTICLE_PER_BULLET;
        for(let i = 0; i<NUMBER_PARTICLE_PER_BULLET; i++) {
            let newParticle = new particle(this, i * bulletDeg);
            this.particles.push(newParticle);
        }
    }

    remove(){
        this.fireworks.bullets.splice(this.fireworks.bullets.indexOf(this), 1);
    }

    update(){
        if (this.particles.length ==0) {
            this.remove();
        }
        this.particles.forEach(particle => particle.update());
    }

    draw(){
        this.particles.forEach(particle => particle.draw());
    }
}

class fireworks{
    constructor(){  
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;

        this.bullets = [];

        setInterval(() => {
            let newBullet = new bulletFire(this);
            this.bullets.push(newBullet);
        }, 300);        

        this.loop();
    }

    loop() {
        this.bullets.forEach(bullet => bullet.update());
        this.draw();
        setTimeout( () => this.loop(), 20);
    }

    draw(){
        this.bullets.forEach( bullet => bullet.draw());
    }
}

function movePaddle(direction) {
    switch (direction) {
        case Direction.LEFT:
            paddle.dx = -paddle.speed;
            break;
        case Direction.RIGHT:
            paddle.dx = paddle.speed;
            break;
        case Direction.STOP:
            paddle.dx = 0;
            break;
    }
}

function touchCancel(e) {
    touchX = null;
    movePaddle(Direction.STOP);
}


function touchEnd(e) {
    touchX = null;
    movePaddle(Direction.STOP);
}

function touchMove(e) {
    touchX = e.touches[0].clientX;
}

function serve(i) {
    if (balls[i].dy != 0) return;
    
    let range = Math.PI - minAngle * 2;
    let angle = Math.random() * range + minAngle;
    applyBallSpeed(i, itemSticky ? Math.PI / 2 : angle);
} 

function touchStart(e) {
    if (numballs>1 || balls[0].dy == 0) {
        if (gameOver) {
            newGame();
        }
        return;
    }
    touchX = e.touches[0].clientX;
}

function keyDownHandler(e) {
    switch (e.keyCode) {
        case 32: //space
            if (gameOver) {
                return;
            }
            if (itemSticky) {
                for (let i=0; i<numBalls; i++) serve(i);
            }
            else 
                if (numBalls == 1 && balls[0].dy == 0) {
                    balls[0].dx = saveBallMini.dx ;
                    balls[0].dy = saveBallMini.dy;
                }
            break;
        case 37: 
            if (balls[0].dy!=0 || numBalls>1 || itemSticky) movePaddle(Direction.LEFT);
            break;
        case 39: 
            if (balls[0].dy!=0 || numBalls>1 || itemSticky) movePaddle(Direction.RIGHT);
            break;
    }
}

function keyUpHandler(e) {
    switch (e.keyCode) {
        case 37:
        case 39:
            movePaddle(Direction.STOP);
            break;
    }
}

function mouseMoveHandler(e) {
    if (gameOver) return;
    let lastPaddleX = paddle.x;
    var rect = canvas.getBoundingClientRect();
    let px = e.clientX-rect.left; 
    let py = e.clientY-rect.top;
    let fx = px; 
    let fy = py; 

    if (px < paddle.width/2 + wall) px = paddle.width/2 + wall;

    if (numBalls == 1) {
        if (fx > GAME_WIDTH - wall) fx = GAME_WIDTH- wall;
        if (fx < wall) fx = wall;
        if (fy > balls[0].y) fy = balls[0].y;
        if (fy < wall) fy = wall;
    }
    mousePos.x = fx;
    mousePos.y = fy;
    if (numBalls == 1 && balls[0].dy == 0 && !itemSticky) return;
    paddle.x = px;
    if (itemSticky) {
        for (let i=0; i<numBalls; i++) {
            if (balls[i].dy == 0) {
                balls[i].x += paddle.x - lastPaddleX;
            }
        }
    }
}

function mouseClick(e) {
    if (gameOver) {
        return;
    }
    if (itemSticky) {
        for (let i=0; i<numBalls; i++) serve(i);
    }
    else 
        if (numBalls == 1 && balls[0].dy == 0){
            balls[0].dx = saveBallMini.dx;
            balls[0].dy = saveBallMini.dy;
        }
}

function applyBallSpeed(i, angle) {
    balls[i].dx = ball.speed * Math.cos(angle);
    balls[i].dy = -ball.speed * Math.sin(angle);
}

function getMousePose(event){
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top 
    }
}

function spinBall(i) {
    let angle = Math.atan2(-balls[i].dy, balls[i].dx);
    angle += (Math.random() * Math.PI / 4 - Math.PI / 8) * ballSpin;
    if (balls[i].dy<0) {
        if (angle < minAngle) {
            angle = minAngle;
        } else if (angle > Math.PI - minAngle) {
            angle = Math.PI - minAngle;
        }
    } else {
        if (angle > -minAngle) {
            angle = -minAngle;
        } else if (angle < -Math.PI + minAngle) {
            angle = -Math.PI + minAngle;
        }
    }
    applyBallSpeed(i, angle);
}

function outOfBounds() {
    lives--;
    if (lives == 0) {
        gameOver = true;
    }
    newBall();
}

function updateBall() {
    for (let i=0; i<numBalls; i++) {
        balls[i].x += balls[i].dx * delta;
        balls[i].y += balls[i].dy * delta;
        if (balls[i].x < wall + ball.radius) {
            balls[i].x = wall + ball.radius;
            balls[i].dx = -balls[i].dx;
            touchAudio.currentTime = 0; 
            touchAudio.play();
        } else if (balls[i].x > GAME_WIDTH - wall - ball.radius) {
            balls[i].x = GAME_WIDTH - wall - ball.radius;
            balls[i].dx = -balls[i].dx;
            touchAudio.currentTime = 0; 
            touchAudio.play();
        } else if (balls[i].y < wall + ball.radius) {
            balls[i].y = wall + ball.radius;
            balls[i].dy = -balls[i].dy;
            touchAudio.currentTime = 0; 
            touchAudio.play();
        }
    }

    changeToBrick = new Brick(paddle.x - paddle.width / 2, paddle.y - paddle.height / 2, paddle.width, paddle.height, '', 0, 0);

    for (let i=0; i<numBalls; i++) {
        if (changeToBrick.touch(balls[i])) {
            balls[i].y = paddle.y - paddle.height * 0.5 - ball.radius;
            if (itemSticky) { 
                balls[i].dx = 0;
                balls[i].dy = 0;
            } else {
                balls[i].dy = -balls[i].dy;
                if (balls[i].dy != 0) {
                    touchAudio.currentTime = 0; 
                    touchAudio.play();
                    let angle = (((paddle.x + paddle.width/2 + ball.radius - balls[i].x) / (paddle.width + 2 * ball.radius)) * 130 + 25) /180 * Math.PI;
                    applyBallSpeed(i, angle);
                }
            }
        }
    
        if (itemSuper) {
            shadows[i].push({x: balls[i].x, y: balls[i].y, radius: ball.radius});
            if (shadows[i].length > 15){
                shadows[i].shift();
            }
        }

        if (balls[i].y > GAME_HEIGHT) {
            if (numBalls <= 1) outOfBounds();
            else {
                balls[i] = balls[numBalls-1];
                shadows[i] = shadows[numBalls-1];
                numBalls--;
                i--;
            }
        }
    }
}

function updatePaddle() {
    if (touchX != null) {
        if (touchX > paddle.x + wall) {
            movePaddle(Direction.RIGHT);
        } else if (touchX < paddle.x - wall) {
            movePaddle(Direction.LEFT);
        } else {
            movePaddle(Direction.STOP);
        }
    }

    let lastPaddleX = paddle.x;
    paddle.x += paddle.dx * delta;

    if (paddle.x < wall + paddle.width * 0.5) {
        paddle.x = wall + paddle.width * 0.5;
    } else if (paddle.x > GAME_WIDTH - wall - paddle.width * 0.5) {
        paddle.x = GAME_WIDTH - wall - paddle.width * 0.5;
    }
    
    for (let i=0; i<numBalls; i++) {
        if (balls[i].dy == 0) {
            balls[i].x += paddle.x - lastPaddleX;
        }
    }

    for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].x + items[i].width * 0.5 > paddle.x - paddle.width * 0.5
            && items[i].x - items[i].width * 0.5 < paddle.x + paddle.width * 0.5
            && items[i].y + items[i].height * 0.5 > paddle.y - paddle.height * 0.5
            && items[i].y - items[i].height * 0.5 < paddle.y + paddle.height * 0.5) 
        {
            itemAudio.currentTime = 0;
            itemAudio.play(); 
            switch(items[i].type) {
                case itemType.EXTENSION:
                    if (itemMini) {
                        itemMini = false;
                        itemExtension = false;
                        ball.radius = wall * 1.1;
                        for(j=0;j<numBalls;j++){
                            if (balls[j].dy == 0) balls[j].y = paddle.y - paddle.height/2 - balls[j].radius; 
                        }
                        clearTimeout(timeOutExtension);
                        clearTimeout(timeOutMini);
                        break;
                    }
                    if (itemExtension) {
                        score += itemBonus;
                        clearTimeout(timeOutExtension);
                        timeOutExtension = setTimeout( () => {
                            itemExtension = false;
                            ball.radius = ball.radius/3*2;
                            for(j=0;j<numBalls;j++){
                                if (balls[j].dy == 0) balls[j].y = paddle.y - paddle.height/2 - balls[j].radius; 
                            }
                        }, 10000);
                    } else {
                        itemExtension = true;
                        ball.radius = ball.radius*3/2;
                        timeOutExtension = setTimeout( () => {
                            itemExtension = false;
                            ball.radius = ball.radius/3*2;
                            for(j=0;j<numBalls;j++){
                                if (balls[j].dy == 0) balls[j].y = paddle.y - paddle.height/2 - balls[j].radius; 
                            }
                        }, 10000);
                    }
                    break;
                case itemType.MINISIZE:
                    if (itemExtension) {
                        itemMini = false;
                        itemExtension = false;
                        ball.radius = wall * 1.1;
                        for(j=0;j<numBalls;j++){
                            if (balls[j].dy == 0) balls[j].y = paddle.y - paddle.height/2 - balls[j].radius; 
                        }
                        clearTimeout(timeOutExtension);
                        clearTimeout(timeOutMini);
                        break;
                    }
                    if (itemMini) {
                        score += itemBonus;
                        clearTimeout(timeOutMini);
                        timeOutMini = setTimeout( () => {
                            itemMini = false;
                            ball.radius = ball.radius*3/2;
                            for(j=0;j<numBalls;j++){
                                if (balls[j].dy == 0) balls[j].y = paddle.y - paddle.height/2 - balls[j].radius; 
                            }
                        }, 10000);
                    } else {
                        itemMini = true;
                        ball.radius = ball.radius/3*2;
                        timeOutMini = setTimeout( () => {
                            itemMini = false;
                            ball.radius = ball.radius*3/2;
                            for(j=0;j<numBalls;j++){
                                if (balls[j].dy == 0) balls[j].y = paddle.y - paddle.height/2 - balls[j].radius; 
                            }
                        }, 10000);
                    }
                    break;
                case itemType.LIFE:
                    lives++;
                    break;
                case itemType.DIE:
                    lives--;
                    if (lives<=0) gameOver = true;
                    break;
                case itemType.STICKY:
                    if (itemSticky) {
                        score += itemBonus;
                        clearTimeout(timeOutSticky);
                        timeOutSticky = setTimeout( () => {
                            itemSticky = false;
                            for (let j=0; j<numBalls; j++) {
                                if (balls[j].dy == 0) serve(j);
                            }
                        }, 10000);
                    } else {
                        itemSticky = true;
                        timeOutSticky = setTimeout( () => {
                            itemSticky = false;
                            for (let j=0; j<numBalls; j++) {
                                if (balls[j].dy == 0) serve(j);
                            }
                        }, 10000);
                    }
                    break;
                case itemType.SUPER:
                    if (itemSuper) {
                        score += itemBonus;
                        clearTimeout(timeOutSuper);
                        timeOutSuper = setTimeout( () => {
                            itemSuper = false;
                            for(let j=0; j<numBalls; j++) shadows[j] = [];
                        }, 10000);
                    } else {
                        itemSuper = true;
                        timeOutSuper = setTimeout( () => {
                            itemSuper = false;
                            for(let j=0; j<numBalls; j++) shadows[j] = [];
                        }, 10000);
                    }
                    break;
                case itemType.LONG:
                    if (itemShort) {
                        itemShort = false;
                        itemLong = false;
                        paddle.width *= 2;
                        if (itemSticky) {
                            for(let j=0; j<numBalls; j++){
                                if (balls[j].dy == 0) {
                                    balls[j].x = paddle.x+(balls[j].x-paddle.x)*2;
                                }
                            }
                        }
                        clearTimeout(timeOutLong);
                        clearTimeout(timeOutShort);
                        break;
                    }
                    if (itemLong) {
                        score += itemBonus;
                        clearTimeout(timeOutLong);
                        timeOutLong = setTimeout( () => {
                            itemLong = false;
                            paddle.width /= 2;
                            if (itemSticky) {
                                for(let j=0; j<numBalls; j++){
                                    if (balls[j].dy == 0) {
                                        balls[j].x = paddle.x+(balls[j].x-paddle.x)/2;
                                    }
                                }
                            }
                        }, 10000);
                    } else {
                        if (itemSticky) {
                            for(let j=0; j<numBalls; j++){
                                if (balls[j].dy == 0) {
                                    balls[j].x = paddle.x+(balls[j].x-paddle.x)*2;
                                }
                            }
                        }
                        itemLong = true;
                        paddle.width *= 2;
                        timeOutLong = setTimeout( () => {
                            itemLong = false;
                            paddle.width /= 2;
                            if (itemSticky) {
                                for(let j=0; j<numBalls; j++){
                                    if (balls[j].dy == 0) {
                                        balls[j].x = paddle.x+(balls[j].x-paddle.x)/2;
                                    }
                                }
                            }
                        }, 10000);
                    }
                    break;
                case itemType.SHORT:
                    if (itemLong) {
                        itemShort = false;
                        itemLong = false;
                        paddle.width /= 2;
                        if (itemSticky) {
                            for(let j=0; j<numBalls; j++){
                                if (balls[j].dy == 0) {
                                    balls[j].x = paddle.x+(balls[j].x-paddle.x)/2;
                                }
                            }
                        }
                        clearTimeout(timeOutLong);
                        clearTimeout(timeOutShort);
                        break;
                    }
                    if (itemShort) {
                        score += itemBonus;
                        clearTimeout(timeOutShort);
                        timeOutShort = setTimeout( () => {
                            itemShort = false;
                            paddle.width *= 2;
                            if (itemSticky) {
                                for(let j=0; j<numBalls; j++){
                                    if (balls[j].dy == 0) {
                                        balls[j].x = paddle.x+(balls[j].x-paddle.x)*2;
                                    }
                                }
                            }
                        }, 10000);
                    } else {
                        if (itemSticky) {
                            for(let j=0; j<numBalls; j++){
                                if (balls[j].dy == 0) {
                                    balls[j].x = paddle.x+(balls[j].x-paddle.x)/2;
                                }
                            }
                        }
                        itemShort = true;
                        paddle.width /= 2;
                        timeOutShort = setTimeout( () => {
                            itemShort = false;
                            paddle.width *= 2;
                            if (itemSticky) {
                                for(let j=0; j<numBalls; j++){
                                    if (balls[j].dy == 0) {
                                        balls[j].x = paddle.x+(balls[j].x-paddle.x)*2;
                                    }
                                }
                            }
                        }, 10000);
                    }
                    break;
                case itemType.FAST:
                    if (itemSlow) {
                        delta = 0.02;
                        itemSlow = false;
                        itemFast = false;
                        clearTimeout(timeOutFast);
                        clearTimeout(timeOutSlow);
                        break;
                    }
                    if (itemFast) {
                        score += itemBonus;
                        clearTimeout(timeOutFast);
                        timeOutFast = setTimeout( () => {
                            itemFast = false;
                            delta = delta/3*2;
                        }, 10000);
                    } else {
                        itemFast = true;
                        delta = delta*3/2;
                        timeOutFast = setTimeout( () => {
                            itemFast = false;
                            delta = delta/3*2;
                        }, 10000);
                    }
                    break;
                case itemType.SLOW:
                    if (itemFast) {
                        delta = 0.02;
                        itemSlow = false;
                        itemLong = false;
                        clearTimeout(timeOutFast);
                        clearTimeout(timeOutSlow);
                        break;
                    }
                    if (itemSlow) {
                        score += itemBonus;
                        clearTimeout(timeOutSlow);
                        timeOutSlow = setTimeout( () => {
                            itemSlow = false;
                            delta = delta*3/2;
                        }, 10000);
                    } else {
                        itemSlow = true;
                        delta = delta/3*2;
                        timeOutSlow = setTimeout( () => {
                            itemSlow = false;
                            delta = delta*3/2;
                        }, 10000);
                    }
                    break;
                case itemType.SHOOT:
                    if (itemShoot) {
                        score += itemBonus;
                        clearTimeout(timeOutShoot);
                        timeOutShoot = setTimeout( () => {
                            itemShoot = false;
                        }, 10000);
                    } else {
                        itemShoot = true;
                        bulletLeft = [];
                        bulletRight = [];
                        timeOutShoot = setTimeout( () => {
                            itemShoot = false;
                        }, 10000);
                    }
                    break;
                case itemType.X3:
                    score += itemBonus;
                    let tmp = numBalls-1;
                    for(let j=0; j<numBalls; j++) {
                        applyBallSpeed(j, Math.PI/2); 
                        tmp++;
                        balls[tmp] = new Ball();
                        balls[tmp].x = balls[j].x;
                        balls[tmp].y = balls[j].y;
                        balls[tmp].speed = ball.speed;
                        balls[tmp].radius = ball.radius;
                        shadows[tmp] = [];
                        applyBallSpeed(tmp, Math.PI/4);
                        
                        tmp++;
                        balls[tmp] = new Ball();
                        balls[tmp].x= balls[j].x;
                        balls[tmp].y= balls[j].y;
                        balls[tmp].speed = ball.speed;
                        balls[tmp].radius = ball.radius;
                        shadows[tmp] = [];
                        applyBallSpeed(tmp, Math.PI/4*3);
                    }
                    numBalls = tmp+1;
                    break;
            }
            items.splice(i, 1);  
        }
    }
}

function powerUp(x, y, size, type) {
    this.width = size;
    this.height = size;
    this.x = x;
    this.y = y;
    this.type = type;
    this.dy = itemSpeed * GAME_HEIGHT;
}

function updateBricks() {
    OUTER: for (let i = 0; i < bricks.length; i++) {
        for (let j = 0; j < numBrickCol; j++) {
            for (let k = 0; k<numBalls; k++) {
                if (bricks[i][j] != null && bricks[i][j].touch(balls[k])) {
                    score += bricks[i][j].score;
                    ball.setSpeed(bricks[i][j].speedMult);
 
                    if (Math.random() <= itemChance) {
                        let px = bricks[i][j].left + bricks[i][j].width / 2;
                        let py = bricks[i][j].top + bricks[i][j].height / 2;
                        let iSize = bricks[i][j].width / 2;
                        let iKeys = Object.keys(itemType);
                        let iKey = iKeys[Math.floor(Math.random() * iKeys.length)];
                        items.push(new powerUp(px, py, iSize, itemType[iKey]));
                    }

                    if (!itemSuper) {
                        if ((balls[k].x<bricks[i][j].left || balls[k].x>bricks[i][j].left+bricks[i][j].width) 
                            && balls[k].y>=bricks[i][j].top && balls[k].y<=bricks[i][j].top+bricks[i][j].height 
                            && Math.abs(balls[k].dx)>Math.abs(balls[k].dy)) balls[k].dx = -balls[k].dx;
                        else balls[k].dy = -balls[k].dy;
                    }
                    bricks[i][j] = null;
                    numBricks--;
                    touchAudio.currentTime = 0; 
                    touchAudio.play();
                    break OUTER;
                }
            }
        }
    }    

    if (numBricks <= 0) {
        clearTimeout(level1_9);
        newBall();
        gameOver = true;
        win = true;
        var f = new fireworks();
    }
}


function updateItems() {
    for (let i = items.length - 1; i >= 0; i--) {
        items[i].y += items[i].dy * delta;
        if (items[i].y - items[i].height * 0.5 > GAME_HEIGHT) {
            items.splice(i, 1);
        }
    }
}

function drawBullet(){
    for(let i=0; i<bulletLeft.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = 'orange';
        ctx.arc(bulletLeft[i].x, bulletLeft[i].y, wall/2, 0, 2*Math.PI); 
        ctx.fill();
    }
    for(let i=0; i<bulletRight.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = 'orange';
        ctx.arc(bulletRight[i].x, bulletRight[i].y, wall/2, 0, 2*Math.PI); 
        ctx.fill();
    }
    bulletAudio.play();
}

function updateBullet(){
    OUTER: for (let i=0; i<bulletLeft.length; i++) {
        bulletLeft[i].y -= wall/3*2;
        if (bulletLeft[i].y <= wall*4/3) {
            bulletLeft.splice(i,1);
            break OUTER;  
        }
        for (let j = bricks.length-1; j>=0; j--) {
            for (let k = 0; k < numBrickCol; k++) 
                if (bricks[j][k] !== null){
                    let ballBullet = new Ball();
                    ballBullet.x = bulletLeft[i].x;
                    ballBullet.y = bulletLeft[i].y;
                    ballBullet.radius = wall/2;
                    if (bricks[j][k].touch(ballBullet)){
                        bricks[j][k] = null;
                        numBricks--;
                        bulletLeft.splice(i,1);
                        break OUTER; 
                    }
            }
        }
    }
    OUTER: for (let i=0; i<bulletRight.length; i++) {
        bulletRight[i].y -= wall/3*2;  
        if (bulletRight[i].y <= wall*4/3) {
            bulletRight.splice(i,1);
            break OUTER;
        }
        for (let j = bricks.length-1; j>=0; j--) {
            for (let k = 0; k < numBrickCol; k++) 
                if (bricks[j][k] !== null){
                    let ballBullet = new Ball();
                    ballBullet.x = bulletRight[i].x;
                    ballBullet.y = bulletRight[i].y;
                    ballBullet.radius = wall/2;
                    if (bricks[j][k].touch(ballBullet)){
                        bricks[j][k] = null;
                        numBricks--;
                        bulletRight.splice(i,1);
                        break OUTER; 
                    }
            }
        }
    }
    if (bulletLeft.length==0 || (bulletLeft.length>0 && Math.abs(bulletLeft[bulletLeft.length-1].y-paddle.y + paddle.height*7/6) >= 15*wall)) {
        bulletLeft.push({x: paddle.x-paddle.width/3, y: paddle.y - paddle.height*7/6});
    }
    if (bulletRight.length==0 || (bulletRight.length>0 && Math.abs(bulletRight[bulletRight.length-1].y-paddle.y + paddle.height*7/6) >= 15*wall)) {
        bulletRight.push({x: paddle.x+paddle.width/3, y: paddle.y - paddle.height*7/6});
    }
    if (numBricks <= 0) {
        clearTimeout(level1_9);
        newBall();
        gameOver = true;
        win = true;
        var f = new fireworks();
    }
}

function drawPaddle() {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x - paddle.width / 2, paddle.y - paddle.height / 2, paddle.width, paddle.height);
    ctx.fillStyle = itemSticky ? itemType.STICKY.color : COLOR_PADDLE;
    ctx.fillRect(paddle.x - paddle.width / 2, paddle.y - paddle.height / 2, paddle.width, paddle.height);
    if (itemShoot) {
        ctx.fillRect(paddle.x - paddle.width/12*5, paddle.y - paddle.height*5/6, paddle.width/6, paddle.height/3);
        ctx.fillRect(paddle.x - paddle.width/8*3, paddle.y - paddle.height*7/6, paddle.width/12, paddle.height/3);

        ctx.fillRect(paddle.x + paddle.width/4*1, paddle.y - paddle.height*5/6, paddle.width/6, paddle.height/3);
        ctx.fillRect(paddle.x + paddle.width/24*7, paddle.y - paddle.height*7/6, paddle.width/12, paddle.height/3);
        updateBullet();
        drawBullet();
    }

    ctx.beginPath();
    ctx.lineWidth = wall;
    ctx.strokeStyle = '#BBBBBB';

    //ctx.lineWidth = wall;
    ctx.moveTo(wall + paddle.width/2, GAME_HEIGHT/10*9.5);
    ctx.lineTo(GAME_WIDTH - wall - paddle.width/2, GAME_HEIGHT*0.95);
    ctx.stroke();
    let paddleControl = new Image();
    paddleControl.src = "../img/control.png";
    ctx.drawImage(paddleControl, 0, 0, paddleControl.width, paddleControl.height, 
        paddle.x - wall*5/4, GAME_HEIGHT*0.95-wall*5/4, wall*5/2, wall*5/2);
    ctx.lineWidth = 1;
}

function drawBackground() {
    //ctx.fillStyle = COLOR_BACKGROUND;
    //ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    let background = new Image();
    background.src = "../img/"+localStorage.getItem("levelSelected")+".png";
    ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, GAME_WIDTH, GAME_HEIGHT);
}

function drawWalls() {
    let centerWall = wall * 0.5;
    ctx.lineWidth = wall;
    ctx.strokeStyle = COLOR_WALL;
    ctx.beginPath();
    ctx.moveTo(centerWall, GAME_HEIGHT);
    ctx.lineTo(centerWall, centerWall);
    ctx.lineTo(GAME_WIDTH - centerWall, centerWall);
    ctx.lineTo(GAME_WIDTH - centerWall, GAME_HEIGHT);
    ctx.stroke();
}

function drawItems() {
    ctx.lineWidth = wall * 0.35;
    for (let item of items) {
        ctx.fillStyle = item.type.color;
        ctx.strokeStyle = item.type.color;
        ctx.strokeRect(item.x - item.width * 0.5, item.y - item.height * 0.5, item.width, item.height);
        ctx.font = "bold " + item.height + "px " + TEXT_FONT;
        ctx.textAlign = "center";
        ctx.fillText(item.type.symbol, item.x, item.y);
    }
}

function drawBricks() {
    for (let row of bricks) {
        for (let brick of row) {
            if (brick == null) {
                continue;
            }
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.fillStyle = brick.color;
            ctx.fillRect(brick.left, brick.top, brick.width, brick.height);
            ctx.strokeRect(brick.left, brick.top, brick.width, brick.height);
        }
    }
}

function drawSmallBall(fx, fy) {
    let angle;
    if (fy == 0) {
        if (fx>=0) angle = minAngle;
        else angle = Math.PI - minAngle; 
    } else {
        angle = Math.atan2(-fy, fx);
        if (angle < minAngle) {
            angle = minAngle;
        } else if (angle > Math.PI - minAngle) {
            angle = Math.PI - minAngle;
        }
    }

    let turn = 0;
    let ballMini = new Ball();
    ballMini.x = balls[0].x;
    ballMini.y = balls[0].y;
    ballMini.radius = ball.radius;
    ballMini.dx = ball.speed * Math.cos(angle) * 2.5 * delta;
    ballMini.dy = -ball.speed * Math.sin(angle) * 2.5 * delta;
    saveBallMini.dx = ball.speed * Math.cos(angle);
    saveBallMini.dy = -ball.speed * Math.sin(angle);

    while (true) {
        ctx.fillStyle = COLOR_BALL;
        ballMini.x += ballMini.dx;
        ballMini.y += ballMini.dy;
        if (ballMini.x < wall + ball.radius) {
            ballMini.x = wall + ball.radius;
            ballMini.dx = -ballMini.dx;
            turn++;
            if (turn == 3) return;
        }
        if (ballMini.x > GAME_WIDTH-wall-ball.radius) {
            ballMini.x = GAME_WIDTH-wall-ball.radius;
            ballMini.dx = -ballMini.dx;
            turn++;
            if (turn == 3) return;
        } 
        if (ballMini.y<wall) {
            ballMini.y = wall;
            ballMini.dy = -ballMini.dy;
            turn++;
            if (turn == 3) return;
        }
        
        if (ballMini.y > GAME_HEIGHT) return;
        let ok = true;
        for (let i = 0; i < bricks.length; i++) {
            for (let j = 0; j < numBrickCol; j++) {
                if (bricks[i][j] != null && bricks[i][j].touch(ballMini)) {
                    ok = false;
                    turn++;
                    if (turn == 3) return;
                    if ((ballMini.x < bricks[i][j].left || ballMini.x > bricks[i][j].left+bricks[i][j].width) 
                        && ballMini.y >= bricks[i][j].top && ballMini.y <= bricks[i][j].top+bricks[i][j].height
                        && Math.abs(ballMini.dx)>Math.abs(ballMini.dx)) ballMini.dx = -ballMini.dx;
                    else ballMini.dy = -ballMini.dy;
                }
            }
        }
        if (ok) {
            ctx.beginPath();
            ctx.arc(ballMini.x, ballMini.y, ballMini.radius/3, 0, 2*Math.PI); 
            ctx.fill();
            ctx.closePath();
        }
    }
}

function drawBall() {
    for(let i=0; i<numBalls; i++) {
        ctx.beginPath();
        ctx.fillStyle = itemSuper ? itemType.SUPER.color : COLOR_BALL;
        ctx.strokeStyle = 'black';
        ctx.arc(balls[i].x, balls[i].y, ball.radius, 0, 2*Math.PI); 
        ctx.fill();
        ctx.stroke();
        if (itemSuper){
            for(let j = shadows[i].length-1; j>=0; j--) {
                ctx.beginPath();
                var rgbsC = 'rgba(255, 0, 255, ' + `${(j/3*2)/ (shadows[i].length+0.5)}` + ')';
                ctx.fillStyle = rgbsC;
                ctx.arc(shadows[i][j].x, shadows[i][j].y, shadows[i][j].radius-(shadows[i].length-1 - j)*0.02*shadows[i][j].radius, 0, 2*Math.PI);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    if (numBalls == 1 && balls[0].dx == 0 && balls[0].dy == 0 && !itemSticky && !gameOver) {
        drawSmallBall(mousePos.x-balls[0].x, mousePos.y-balls[0].y);
    }
}

function drawText() {
    ctx.fillStyle = COLOR_TEXT;

    let labelSize = textSize * 0.5;
    let margin = wall * 2;
    let maxWidth = GAME_WIDTH - margin * 2;
    let maxWidth1 = maxWidth * 0.27;
    let maxWidth2 = maxWidth * 0.2;
    let maxWidth3 = maxWidth * 0.2;
    let x1 = margin;
    let x2 = GAME_WIDTH * 0.5;
    let x3 = GAME_WIDTH * 0.8;
    let yLabel = wall + labelSize;
    let yValue = yLabel + textSize * 0.9;

    ctx.font = "bold " + labelSize + "px " + TEXT_FONT;
    ctx.textAlign = "left";
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillText(TEXT_SCORE, x1, yLabel, maxWidth1);
    ctx.strokeText(TEXT_SCORE, x1, yLabel, maxWidth1);
    ctx.textAlign = "center";
    ctx.fillText(TEXT_LIVES, x2, yLabel, maxWidth2);
    ctx.strokeText(TEXT_LIVES, x2, yLabel, maxWidth2);
    ctx.fillText(TEXT_LEVEL, x3, yLabel, maxWidth3);
    ctx.strokeText(TEXT_LEVEL, x3, yLabel, maxWidth3);

    ctx.font = "bold " + textSize + "px " + TEXT_FONT;
    ctx.textAlign = "left";
    ctx.fillText(score, x1, yValue, maxWidth1);
    ctx.strokeText(score, x1, yValue, maxWidth1);
    ctx.textAlign = "center";
    ctx.fillText(lives + "/" + gameLives, x2, yValue, maxWidth2);
    ctx.strokeText(lives + "/" + gameLives, x2, yValue, maxWidth2);
    ctx.fillText(level, x3, yValue, maxWidth3);
    ctx.strokeText(level, x3, yValue, maxWidth3);

    if (gameOver) {
        let text = win ? TEXT_WIN : TEXT_GAME_OVER;
        if (win) {
            winAudio.play();
        } else {
            gameOverAudio.play();
        }
        ctx.font = textSize + "px " + TEXT_FONT;
        ctx.textAlign = "center";
        ctx.fillText(text, GAME_WIDTH * 0.5, paddle.y - textSize, maxWidth);
        setTimeout(() => {
            if (win) {
                let total = parseInt(localStorage.getItem("totalCoin"), 10);
                total += score;
                localStorage.setItem("totalCoin", total.toString());
            }
            return window.location.assign('chapter.html');
        }, 4000);
    }
}

function loop() {
    if (!gameOver) {
        updatePaddle();
        updateBall();
        updateBricks();
        updateItems();
    }

    drawBackground();
    drawWalls();
    drawItems();
    drawPaddle();
    drawBricks();
    drawText();
    drawBall();
    level1_9 = setTimeout(loop, 20);
}

function Paddle() {
    this.width = paddleWidth * GAME_WIDTH;
    this.height = wall * paddleSize;
    this.x = GAME_WIDTH / 2;
    this.y = GAME_HEIGHT - wall * 10 + this.height / 2;
    this.speed = paddleSpeed * GAME_WIDTH;
    
    this.dx = 0;
}

function Ball() {
    this.radius = wall*1.1;
    this.x = paddle.x;
    this.y = paddle.y - paddle.height / 2 - this.radius;
    this.speed = ballSpeed * GAME_HEIGHT;
    
    this.dx = 0;
    this.dy = 0;

    this.setSpeed = function(speedMult) {
        this.speed = Math.max(this.speed, ballSpeed * GAME_HEIGHT * speedMult);
    }
}

function Brick(left, top, width, height, color, score, speedMult) {
    this.width = width;
    this.height = height;
    this.bot = top + height;
    this.left = left;
    this.right = left + width;
    this.top = top;
    this.color = color;
    this.score = score;
    this.speedMult = speedMult;

    this.touch = function(ball) {  
        let px = ball.x, py = ball.y; 
        if(px < this.left) px = this.left;
        else 
            if (px > this.right) px = this.right;

        if (py < this.top) py = this.top;
        else 
            if(py > this.bot) py = this.bottom;
        
        let fx = ball.x - px;
        let fy = ball.y - py;
        return (fx*fx + fy*fy) <= ball.radius*ball.radius;
    }
} 

function newBall() {
    itemExtension = false;
    itemMini = false;
    itemSticky = false;
    itemSuper = false;
    itemLong = false;
    itemShort = false;
    itemShoot = false;
    itemFast = false;
    itemSlow = false;
    itemX3 = false;
    clearTimeout(timeOutSuper); 
    clearTimeout(timeOutSticky); 
    clearTimeout(timeOutExtension); 
    clearTimeout(timeOutMini); 
    clearTimeout(timeOutLong); 
    clearTimeout(timeOutShort); 
    clearTimeout(timeOutShoot); 
    clearTimeout(timeOutFast); 
    clearTimeout(timeOutSlow);
    delta = 0.02; 
    numBalls = 1;
    paddle = new Paddle();
    balls[0] = new Ball();
    ball = new Ball();
    shadows[0] = [];
}

function getBrickColor(step, highestStep) {
    let fraction = step / highestStep;
    let r, g, b = 0;

    if (fraction <= 0.67) {
        r = 255;
        g = 255 * fraction / 0.67;
    } else {
        r = 255 * (1 - fraction) / 0.33;
        g = 255;
    }
    return "rgb(" + r + ", " + g + ", " + b + ")";
}


function createBricks() {
    // row
    let minY = wall;
    let maxY = balls[0].y - ball.radius * 1.75; 
    let totalSpaceY = maxY - minY;
    let totalRows = marginBrick + numBrickRow + maxLevel * 2;
    let gap = wall * brickGap;
    let rowRatio = totalSpaceY / totalRows;
    let rowSize = rowRatio - gap;
    textSize = rowRatio * marginBrick * 0.5; 
    
    // column
    let totalSpaceX = GAME_WIDTH - wall * 2;
    let colRatio = (totalSpaceX - gap) / numBrickCol;
    let colSize = colRatio - gap;

    bricks = [];
    let cols = numBrickCol;
    let rows = numBrickRow + level;

    let color, left, step, stepHigh, score, speedMult, top;
    numBricks = cols * rows;
    stepHigh = rows * 0.5 - 1;
    for (let i = 0; i < rows; i++) {
        bricks[i] = [];
        step = Math.floor(i * 0.5);
        
        score = (stepHigh - step) * 2 + 1;  
        speedMult = 1 + (stepHigh - step) / stepHigh * (ballSpeedMax - 1);
        color = getBrickColor(step, stepHigh);

        top = wall + (marginBrick + i) * rowRatio;
        for (let j = 0; j < cols; j++) {
            left = wall + gap + j * colRatio;
            bricks[i][j] = new Brick(left, top, colSize, rowSize, color, score, speedMult);
        }
    }
}

function newLevel() {
    items = [];
    touchX = null;
    newBall();
    createBricks();
}

function newGame() {
    gameOver = false;
    level = parseInt(chapterLevel.charAt(8), 10);
    lives = gameLives;
    score = 0;
    delta = 0.02;
    newLevel();
}

function setGame() {
    GAME_HEIGHT = document.body.clientHeight;
    GAME_WIDTH = document.body.clientWidth;
    wall = WALL * GAME_WIDTH;
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    ctx.textBaseline = "middle";
    newGame();
}

let chapterLevel = localStorage.getItem("levelSelected");
if (chapterLevel.length != 10) {
    canvas.addEventListener("touchcancel", touchCancel);
    canvas.addEventListener("touchend", touchEnd);
    canvas.addEventListener("touchmove", touchMove);
    canvas.addEventListener("touchstart", touchStart);
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener("click", mouseClick);
    window.addEventListener("resize", setGame);
    setGame();
    loop();
}