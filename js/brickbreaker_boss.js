var numFullBricks, fullBlood, numBricksBoss = 8, ball = new Ball();
var colors = ['#6CD9CC', '#FB6578', '#FE5A8F', '#FC9574', '#9A8DF2'];

function getRandom(a, b){
    return Math.random()*(b-a) + a;
}

function movePaddleBoss(direction) {
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

function touchCancelBoss(e) {
    touchX = null;
    movePaddleBoss(Direction.STOP);
}


function touchEndBoss(e) {
    touchX = null;
    movePaddleBoss(Direction.STOP);
}

function touchMoveBoss(e) {
    touchX = e.touches[0].clientX;
}

function applyBallSpeedBoss(angle) {
    ball.dx = ball.speed * Math.cos(angle);
    ball.dy = -ball.speed * Math.sin(angle);
}

function spinBall() {
    let angle = Math.atan2(-ball.dy, ball.dx);
    angle += (Math.random() * Math.PI / 4 - Math.PI / 8) * ballSpin;

    if (ball.dy<0) {
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
    applyBallSpeedBoss(angle);
}

function serveBoss() {
    if (ball.dy != 0) {
        return false;
    }

    let range = Math.PI - minAngle * 2;
    let angle = Math.random() * range + minAngle;
    applyBallSpeedBoss(angle);
    return true;
} 

function touchStartBoss(e) {
    if (serveBoss()) {
        if (gameOver) {
            return;
        }
        return;
    }
    touchX = e.touches[0].clientX;
}

function keyDownHandlerBoss(e) {
    switch (e.keyCode) {
        case 32: //space
            serveBoss();
            if (gameOver) {
                return;
            }
            break;
        case 37: 
            movePaddleBoss(Direction.LEFT);
            break;
        case 39: 
            movePaddleBoss(Direction.RIGHT);
            break;
    }
}

function keyUpHandlerBoss(e) {
    switch (e.keyCode) {
        case 37:
        case 39:
            movePaddleBoss(Direction.STOP);
            break;
    }
}

function mouseMoveHandlerBoss(e) {
    if (gameOver || ball.dy == 0) return;
    var rect = canvas.getBoundingClientRect();
    let px = e.clientX-rect.left; 
    if (px < paddle.width/2 + wall) px = paddle.width/2 + wall;
    if (px > GAME_WIDTH - paddle.width/2 - wall) px = GAME_WIDTH - paddle.width/2 - wall;
    paddle.x = px;
}

function mouseClickBoss(e) {
    if (gameOver) {
        return;
    }
    serveBoss();
}

function outOfBoundsBoss() {
    newBallBoss();
    gameOver = true;
    clearTimeout(loopBoss);
}

function checkTouchBoss(left, right, top, bottom) {
    let px = ball.x, py = ball.y; 
    if(px < left) px = left;
    else 
        if (px > right) px = right;

    if (py < top) py = top;
    else 
        if(py > bottom) py = bottom;
        
    let fx = ball.x - px;
    let fy = ball.y - py;
    return (fx*fx + fy*fy) <= ball.radius*ball.radius;
}

function updateBallBoss() {
    ball.x += ball.dx * delta;
    ball.y += ball.dy * delta;
    if (ball.x < wall + ball.radius) {
        ball.x = wall + ball.radius;
        ball.dx = -ball.dx;
        touchAudio.currentTime = 0; 
        touchAudio.play();
        spinBall();
    } else if (ball.x > GAME_WIDTH - wall - ball.radius) {
        ball.x = GAME_WIDTH - wall - ball.radius;
        ball.dx = -ball.dx;
        touchAudio.currentTime = 0; 
        touchAudio.play();
        spinBall();
    } else if (ball.y < wall + ball.radius) {
        ball.y = wall + ball.radius;
        ball.dy = -ball.dy;
        touchAudio.currentTime = 0; 
        touchAudio.play();
        spinBall();
    }

    if (checkTouchBoss(paddle.x - paddle.width / 2, paddle.x + paddle.width / 2,
    paddle.y - paddle.height / 2, paddle.y - paddle.height / 2)) {
        ball.y = paddle.y - paddle.height * 0.5 - ball.radius;
        ball.dy = -ball.dy;
        if (ball.dy != 0) {
            let angle = (((paddle.x + paddle.width/2 + ball.radius - ball.x) / (paddle.width + 2 * ball.radius)) * 130 + 25) /180 * Math.PI;
            applyBallSpeedBoss(angle);
            touchAudio.currentTime = 0; 
            touchAudio.play();
        }
    }

    if (ball.y > GAME_HEIGHT) {
        outOfBoundsBoss();
    }
}

function updatePaddleBoss() {
    if (ball.dy == 0) return;
    if (touchX != null) {
        if (touchX > paddle.x + wall) {
            movePaddleBoss(Direction.RIGHT);
        } else if (touchX < paddle.x - wall) {
            movePaddleBoss(Direction.LEFT);
        } else {
            movePaddleBoss(Direction.STOP);
        }
    }

    let lastPaddleX = paddle.x;
    paddle.x += paddle.dx * delta;

    if (paddle.x < wall + paddle.width * 0.5) {
        paddle.x = wall + paddle.width * 0.5;
    } else if (paddle.x > GAME_WIDTH - wall - paddle.width * 0.5) {
        paddle.x = GAME_WIDTH - wall - paddle.width * 0.5;
    }

    if (ball.dy == 0) {
        ball.x += paddle.x - lastPaddleX;
    }
}

function updateBricksBoss() {
    OUTER: for (let i = 0; i < bricks.length; i++) {
        if (bricks[i] != null && bricks[i].r >= ball.radius && bricks[i].touch(ball)) {
            bricks[i].r /= 2;
            numFullBricks--;
            ball.dy = -ball.dy;
            spinBall();
            if (numFullBricks == 0) {
                newBallBoss();
                win = true;
                gameOver = true;
                var f = new fireworks();
                return;
            }
            touchAudio.currentTime = 0; 
            touchAudio.play();
            break OUTER;
        }
    }
}

function drawPaddleBoss() {
    //ctx.fillStyle = COLOR_PADDLE;
    //ctx.fillRect(paddle.x - paddle.width / 2, paddle.y - paddle.height / 2, paddle.width, paddle.height);

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#9A8DF2';
    ctx.fillStyle = '#E6F28D';
    let fx = paddle.x - paddle.width / 2;
    let fy = paddle.y - paddle.height / 2;
    ctx.fillRect(fx, fy, paddle.width, paddle.height);
    ctx.fill();
    for (var i = 0; i < paddle.width; i += paddle.height) {
        ctx.lineWidth = 1;
        ctx.moveTo(fx + i, fy);
        ctx.lineTo(fx + paddle.height + i, fy + paddle.height);
        ctx.stroke();
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
        paddle.x - ball.radius*3/4, GAME_HEIGHT*0.95-ball.radius*3/4, ball.radius*3/2, ball.radius*3/2);
    ctx.lineWidth = 1;
}

function drawBackgroundBoss() {
    //ctx.fillStyle = COLOR_BACKGROUND;
    //ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    let background = new Image();
    background.src = "../img/" + chapterLevel + ".png";
    ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, GAME_WIDTH, GAME_HEIGHT);
}

function drawWallsBoss() {
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

function drawBricksBoss() {
    let angle;
    for(i=0; i<numBricksBoss; i++)
        if (bricks[i].r >= ball.radius) {    
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = bricks[i].color;
            ctx.moveTo(bricks[i].x + bricks[i].r, bricks[i].y);
            for (let j = 1; j < 6; j++) {
                angle = Math.PI / 3 * j;
                ctx.lineTo(bricks[i].x + bricks[i].r * Math.cos(angle), 
                    bricks[i].y + bricks[i].r * Math.sin(angle));
                ctx.moveTo(bricks[i].x + bricks[i].r * Math.cos(angle), 
                    bricks[i].y + bricks[i].r * Math.sin(angle));
            }
            ctx.lineTo(bricks[i].x + bricks[i].r, bricks[i].y);
            ctx.stroke();
            ctx.closePath();
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }
}

function drawBallBoss() {
    ctx.beginPath();
    ctx.strokeStyle = '#9A8DF2';
    ctx.lineWidth = 2;
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    //
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius / 4 * 3, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    //
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius /4, 0, 2 * Math.PI);
    ctx.stroke();
    //
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius / 2, 0, 2*Math.PI);
    ctx.stroke();
    ctx.lineWidth = 1;
}

function drawBloodBoss() {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.strokeStyle = COLOR_WALL;
    ctx.lineWidth = 3;
    ctx.fillRect(GAME_WIDTH/4, ball.radius, GAME_WIDTH/2 / fullBlood * numFullBricks, ball.radius*2);
    ctx.strokeRect(GAME_WIDTH/4, ball.radius, GAME_WIDTH/2, ball.radius*2);
    ctx.stroke();
    ctx.fill();
}

function drawTextBoss() {
    if (gameOver) {
        ctx.fillStyle = 'red';
        textSize = wall * 10;
        let margin = wall * 2;
        let maxWidth = GAME_WIDTH - margin * 2;
        let text = win ? TEXT_WIN : TEXT_GAME_OVER;
        bossAudio.pause();
        if (win) {
            winAudio.play();
        } else gameOverAudio.play();
        ctx.font = textSize + "px " + TEXT_FONT;
        ctx.textAlign = "center";
        ctx.fillText(text, GAME_WIDTH * 0.5, paddle.y - textSize, maxWidth);
        ctx.fill();
        setTimeout(() => {
            if (win) {
                let total = parseInt(localStorage.getItem("totalCoin"), 10);
                total += 100;
                localStorage.setItem("totalCoin", total.toString());
            }
            return window.location.assign('chapter.html');
        }, 4000);
    }
}

function loopBoss() {
    if (!gameOver) {
        updatePaddleBoss();
        updateBallBoss();
        updateBricksBoss();
    }

    drawBackgroundBoss();
    drawWallsBoss();
    drawPaddleBoss();
    drawBricksBoss();
    drawBallBoss();
    drawBloodBoss();
    drawTextBoss();

    setTimeout(loopBoss, 20);
}

function PaddleBoss() {
    this.width = paddleWidth * GAME_WIDTH;
    this.height = wall * paddleSize;
    this.x = GAME_WIDTH / 2;
    this.y = GAME_HEIGHT - wall * 10 + this.height / 2;
    this.speed = paddleSpeed * GAME_WIDTH;
    this.dx = 0;
}

function BallBoss() {
    this.radius = 2 * wall;
    this.x = paddle.x;
    this.y = paddle.y - paddle.height / 2 - this.radius;
    this.speed = ballSpeed * GAME_HEIGHT;
    
    this.dx = 0;
    this.dy = 0;

    this.setSpeed = function(speedMult) {
        this.speed = Math.max(this.speed, ballSpeed * GAME_HEIGHT * speedMult);
    }
}

function BrickBoss(x, y, r, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.score = score;
    
    this.touch = function(ball) {  
        if (Math.pow(ball.x-this.x, 2) + Math.pow(ball.y-this.y, 2) > 
            Math.pow(this.r + ball.radius, 2)) return false; 
        if (Math.pow(ball.x-this.x, 2) + Math.pow(ball.y-this.y, 2) <= 
            Math.pow(Math.sqrt(3)*this.r/2 + ball.radius, 2)) return true; 
        
        let minx = this.x + this.r;
        let miny = this.y;
        for (let j = 1; j < 6; j++) {
            let angle = Math.PI / 3 * j;
            if (Math.pow(this.x + this.r * Math.cos(angle) - ball.x, 2) + Math.pow(this.y + this.r * Math.sin(angle) - ball.y, 2) <
                Math.pow(minx - ball.x, 2) + Math.pow(miny - ball.y, 2)) {
                    minx = this.x + this.r * Math.cos(angle);
                    miny = this.y + this.r * Math.sin(angle);
            }
        }
        let a = Math.pow(minx-ball.x, 2) + Math.pow(miny-ball.y, 2);
        let b = Math.pow(this.r, 2);
        let c = Math.pow(this.x-ball.x, 2) + Math.pow(this.y-ball.y, 2);
        angle = Math.abs(Math.acos((b*b+c*c-a*a) / 2*b*c));
        angle = Math.abs(angle-Math.PI/6);
        return Math.sqrt(3)/2*this.r * Math.cos(angle) + ball.radius <= Math.sqrt(c);
    }
} 

function newBallBoss() {
    paddle = new PaddleBoss();
    ball = new BallBoss();
}

function createBricksBoss() {
    let minY = wall;
    let maxY = ball.y - ball.radius * 5; 
    let totalSpaceY = maxY - minY;
    let totalSpaceX = GAME_WIDTH - wall * 2;
    for (i=0; i<numBricksBoss; i++){
        let r = getRandom(totalSpaceX / 8, totalSpaceX / 3);
        let setR = r;
        while (setR>ball.radius) {
            numFullBricks++;
            setR /= 2;
        }
        let x = getRandom(r + wall, totalSpaceX - r);
        let y = getRandom(wall + r, totalSpaceY - r);
        let color = colors[Math.floor(getRandom(0,5))];
        bricks[i] = new BrickBoss(x, y, r, color);
    }
    fullBlood = numFullBricks;
}

function newLevelBoss() {
    newBallBoss();
    createBricksBoss();
}

function newGameBoss() {
    gameOver = false;
    level = 1;
    numFullBricks = 0;
    lives = gameLives;
    score = 0;
    isBoss = true;
    win = false;
    newLevelBoss();
}

function setGameBoss() {
    GAME_HEIGHT = document.body.clientHeight;
    GAME_WIDTH = document.body.clientWidth;
    wall = WALL * GAME_WIDTH;
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    ctx.textBaseline = "middle";
    newGameBoss();
}

chapterLevel = localStorage.getItem("levelSelected");
if (chapterLevel.length == 10) {
    canvas.addEventListener("touchcancel", touchCancelBoss);
    canvas.addEventListener("touchend", touchEndBoss);
    canvas.addEventListener("touchmove", touchMoveBoss);
    canvas.addEventListener("touchstart", touchStartBoss);
    document.addEventListener("keydown", keyDownHandlerBoss, false);
    document.addEventListener("keyup", keyUpHandlerBoss, false);
    document.addEventListener("mousemove", mouseMoveHandlerBoss, false);
    document.addEventListener("click", mouseClickBoss);
    window.addEventListener("resize", setGameBoss);
    paddleSize = 1.5;
    paddleSpeed = 0.5; 
    paddleWidth = 0.15; 
    var bossAudio = new Audio("../mp3/boss.mp3");
    bossAudio.play();
    setGameBoss();
    loopBoss();
}
