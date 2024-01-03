var canvas = document.getElementById("chapter");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;
var GAME_HEIGHT = canvas.height;
var GAME_WIDTH = canvas.width;
var sizeIcon = GAME_WIDTH / 100;
var chapterSelected = '';
var isBoardLevel = false;

function getMousePose(event){
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top 
    }
}

function pointer(){
    let mousePos = this.getMousePose(event);
    if (!isBoardLevel) {
        if (mousePos.x >= GAME_WIDTH/8 && mousePos.y >= GAME_HEIGHT/4 && 
            mousePos.x <= GAME_WIDTH/8+GAME_WIDTH/4 && mousePos.y <= GAME_HEIGHT/4+GAME_HEIGHT/10) {
                document.body.style.cursor = "pointer";
                return;
            }

        if (mousePos.x >= GAME_WIDTH/8*5 && mousePos.y >= GAME_HEIGHT/4 && 
            mousePos.x <= GAME_WIDTH/8*5+GAME_WIDTH/4 && mousePos.y <= GAME_HEIGHT/4+GAME_HEIGHT/10) {
                document.body.style.cursor = "pointer";
                return;
            }

        if (mousePos.x >= GAME_WIDTH/8 && mousePos.y >= GAME_HEIGHT/5*3 && 
            mousePos.x <= GAME_WIDTH/8+GAME_WIDTH/4 && mousePos.y <= GAME_HEIGHT/5*3+GAME_HEIGHT/10) {
                document.body.style.cursor = "pointer";
                return;
            }

        if (mousePos.x >= GAME_WIDTH/8*5 && mousePos.y >= GAME_HEIGHT/5*3 && 
            mousePos.x <= GAME_WIDTH/8*5+GAME_WIDTH/4 && mousePos.y <= GAME_HEIGHT/5*3+GAME_HEIGHT/10) {
                document.body.style.cursor = "pointer";
                return;
            }
    } else {
        if (mousePos.x >= GAME_WIDTH*0.31 && mousePos.y >= GAME_HEIGHT*0.32 && 
            mousePos.x <= GAME_WIDTH*0.4 && mousePos.y <= GAME_HEIGHT*0.39) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.45 && mousePos.y >= GAME_HEIGHT*0.32 && 
            mousePos.x <= GAME_WIDTH*0.54 && mousePos.y <= GAME_HEIGHT*0.39) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.6 && mousePos.y >= GAME_HEIGHT*0.32 && 
            mousePos.x <= GAME_WIDTH*0.69 && mousePos.y <= GAME_HEIGHT*0.39) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.31 && mousePos.y >= GAME_HEIGHT*0.43 && 
            mousePos.x <= GAME_WIDTH*0.4 && mousePos.y <= GAME_HEIGHT*0.5) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.45 && mousePos.y >= GAME_HEIGHT*0.43 && 
            mousePos.x <= GAME_WIDTH*0.54 && mousePos.y <= GAME_HEIGHT*0.5) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.6 && mousePos.y >= GAME_HEIGHT*0.43 && 
            mousePos.x <= GAME_WIDTH*0.69 && mousePos.y <= GAME_HEIGHT*0.5) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.31 && mousePos.y >= GAME_HEIGHT*0.54 && 
            mousePos.x <= GAME_WIDTH*0.4 && mousePos.y <= GAME_HEIGHT*0.61) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.45 && mousePos.y >= GAME_HEIGHT*0.54 && 
            mousePos.x <= GAME_WIDTH*0.54 && mousePos.y <= GAME_HEIGHT*0.61) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.6 && mousePos.y >= GAME_HEIGHT*0.54 && 
            mousePos.x <= GAME_WIDTH*0.69 && mousePos.y <= GAME_HEIGHT*0.61) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.43 && mousePos.y >= GAME_HEIGHT*0.64 && 
            mousePos.x <= GAME_WIDTH*0.57 && mousePos.y <= GAME_HEIGHT*0.73) {
                document.body.style.cursor = "pointer";
                return;
            }
        
        if (mousePos.x >= GAME_WIDTH*0.8 && mousePos.y >= GAME_HEIGHT*0.18 && 
            mousePos.x <= GAME_WIDTH*0.85 && mousePos.y <= GAME_HEIGHT*0.24) {
                document.body.style.cursor = "pointer";
                return;
            }
        
    }
    if (mousePos.x >= GAME_WIDTH/5 && mousePos.y >= GAME_HEIGHT/10*9 && 
        mousePos.x <= GAME_WIDTH/5+GAME_WIDTH/9 && mousePos.y <= GAME_HEIGHT/10*9+GAME_WIDTH/9) {
            document.body.style.cursor = "pointer";
            return;
        }
    if (mousePos.x >= GAME_WIDTH/3*2 && mousePos.y >= GAME_HEIGHT/10*9 && 
        mousePos.x <= GAME_WIDTH/3*2+GAME_WIDTH/9 && mousePos.y <= GAME_HEIGHT/10*9+GAME_WIDTH/9) {
            document.body.style.cursor = "pointer";
            return;
        }
    if (mousePos.x >= GAME_WIDTH/9*3.9 && mousePos.y >= GAME_HEIGHT/10*9 && 
        mousePos.x <= GAME_WIDTH/9*4.9 && mousePos.y <= GAME_HEIGHT/10*9+GAME_WIDTH/9) {
            document.body.style.cursor = "pointer";
            return;
        }
    document.body.style.cursor = "auto";
}

function mouseClick(){
    let mousePos = this.getMousePose(event);
    if (!isBoardLevel)  {
        if (mousePos.x >= GAME_WIDTH/8 && mousePos.y >= GAME_HEIGHT/4 && 
            mousePos.x <= GAME_WIDTH/8+GAME_WIDTH/4 && mousePos.y <= GAME_HEIGHT/4+GAME_HEIGHT/10) {
                chapterSelected = "chapter1";
                isBoardLevel = true;
                return;
            }

        if (mousePos.x >= GAME_WIDTH/8*5 && mousePos.y >= GAME_HEIGHT/4 && 
            mousePos.x <= GAME_WIDTH/8*5+GAME_WIDTH/4 && mousePos.y <= GAME_HEIGHT/4+GAME_HEIGHT/10) {
                chapterSelected = "chapter2";
                isBoardLevel = true;
                return;
            }

        if (mousePos.x >= GAME_WIDTH/8 && mousePos.y >= GAME_HEIGHT/5*3 && 
            mousePos.x <= GAME_WIDTH/8+GAME_WIDTH/4 && mousePos.y <= GAME_HEIGHT/5*3+GAME_HEIGHT/10) {
                chapterSelected = "chapter3";
                isBoardLevel = true;
                return;
            }
        if (mousePos.x >= GAME_WIDTH/8*5 && mousePos.y >= GAME_HEIGHT/5*3 && 
            mousePos.x <= GAME_WIDTH/8*5+GAME_WIDTH/4 && mousePos.y <= GAME_HEIGHT/5*3+GAME_HEIGHT/10) {
                chapterSelected = "chapter4";
                isBoardLevel = true;
                return;
            }
    } else {
        if (mousePos.x >= GAME_WIDTH*0.31 && mousePos.y >= GAME_HEIGHT*0.32 && 
            mousePos.x <= GAME_WIDTH*0.4 && mousePos.y <= GAME_HEIGHT*0.39) {
                localStorage.setItem("levelSelected", chapterSelected+"1");
                return window.location.assign('game.html');
            }
        if (mousePos.x >= GAME_WIDTH*0.45 && mousePos.y >= GAME_HEIGHT*0.32 && 
            mousePos.x <= GAME_WIDTH*0.54 && mousePos.y <= GAME_HEIGHT*0.39) {
                localStorage.setItem("levelSelected", chapterSelected+"2");
                return window.location.assign('game.html');
            }
        if (mousePos.x >= GAME_WIDTH*0.6 && mousePos.y >= GAME_HEIGHT*0.32 && 
            mousePos.x <= GAME_WIDTH*0.69 && mousePos.y <= GAME_HEIGHT*0.39) {
                localStorage.setItem("levelSelected", chapterSelected+"3");
                return window.location.assign('game.html');
            }
        if (mousePos.x >= GAME_WIDTH*0.31 && mousePos.y >= GAME_HEIGHT*0.43 && 
            mousePos.x <= GAME_WIDTH*0.4 && mousePos.y <= GAME_HEIGHT*0.5) {
                localStorage.setItem("levelSelected", chapterSelected+"4");
                return window.location.assign('game.html');
            }
        if (mousePos.x >= GAME_WIDTH*0.45 && mousePos.y >= GAME_HEIGHT*0.43 && 
            mousePos.x <= GAME_WIDTH*0.54 && mousePos.y <= GAME_HEIGHT*0.5) {
                localStorage.setItem("levelSelected", chapterSelected+"5");
                return window.location.assign('game.html');
            }
        if (mousePos.x >= GAME_WIDTH*0.6 && mousePos.y >= GAME_HEIGHT*0.43 && 
            mousePos.x <= GAME_WIDTH*0.69 && mousePos.y <= GAME_HEIGHT*0.5) {
                localStorage.setItem("levelSelected", chapterSelected+"6");
                return window.location.assign('game.html');
            }
        if (mousePos.x >= GAME_WIDTH*0.31 && mousePos.y >= GAME_HEIGHT*0.54 && 
            mousePos.x <= GAME_WIDTH*0.4 && mousePos.y <= GAME_HEIGHT*0.61) {
                localStorage.setItem("levelSelected", chapterSelected+"7");
                return window.location.assign('game.html');
            }
        if (mousePos.x >= GAME_WIDTH*0.45 && mousePos.y >= GAME_HEIGHT*0.54 && 
            mousePos.x <= GAME_WIDTH*0.54 && mousePos.y <= GAME_HEIGHT*0.61) {
                localStorage.setItem("levelSelected", chapterSelected+"8");
                return window.location.assign('game.html');
            }
        if (mousePos.x >= GAME_WIDTH*0.6 && mousePos.y >= GAME_HEIGHT*0.54 && 
            mousePos.x <= GAME_WIDTH*0.69 && mousePos.y <= GAME_HEIGHT*0.61) {
                localStorage.setItem("levelSelected", chapterSelected+"9");
                return window.location.assign('game.html');
            }
        if (mousePos.x >= GAME_WIDTH*0.43 && mousePos.y >= GAME_HEIGHT*0.64 && 
            mousePos.x <= GAME_WIDTH*0.57 && mousePos.y <= GAME_HEIGHT*0.73) {
                localStorage.setItem("levelSelected", chapterSelected+"10");
                return window.location.assign('game.html');
            }
        
        if (mousePos.x >= GAME_WIDTH*0.8 && mousePos.y >= GAME_HEIGHT*0.18 && 
            mousePos.x <= GAME_WIDTH*0.85 && mousePos.y <= GAME_HEIGHT*0.24) {
                isBoardLevel = false;
                return;
            }
    }
    if (mousePos.x >= GAME_WIDTH/5 && mousePos.y >= GAME_HEIGHT/10*9 && 
        mousePos.x <= GAME_WIDTH/5+GAME_WIDTH/9 && mousePos.y <= GAME_HEIGHT/10*9+GAME_WIDTH/9) {
            return window.location.assign('ball.html');
        }
    if (mousePos.x >= GAME_WIDTH/3*2 && mousePos.y >= GAME_HEIGHT/10*9 && 
        mousePos.x <= GAME_WIDTH/3*2+GAME_WIDTH/9 && mousePos.y <= GAME_HEIGHT/10*9+GAME_WIDTH/9) {
            return window.location.assign('home.html');
        }
    if (mousePos.x >= GAME_WIDTH/9*3.9 && mousePos.y >= GAME_HEIGHT/10*9 && 
        mousePos.x <= GAME_WIDTH/9*4.9 && mousePos.y <= GAME_HEIGHT/10*9+GAME_WIDTH/9) {
            return window.location.assign('help.html');   
        }
}

var img = new Image();
img.src = "../img/chapter.png";

function draw() {
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        ctx.fillStyle = 'red';
        ctx.fillRect(GAME_WIDTH/8, GAME_HEIGHT/4, GAME_WIDTH/4, GAME_HEIGHT/10);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${sizeIcon*5}px Nova Squre`;
        ctx.fillText("Chapter 1", GAME_WIDTH/8+sizeIcon*1.7, GAME_HEIGHT/4+sizeIcon*10);
        ctx.fill();

        ctx.fillStyle = 'blue';
        ctx.fillRect(GAME_WIDTH/8*5, GAME_HEIGHT/4, GAME_WIDTH/4, GAME_HEIGHT/10);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${sizeIcon*5}px Nova Squre`;
        ctx.fillText("Chapter 2", GAME_WIDTH/8*5+sizeIcon*1.7, GAME_HEIGHT/4+sizeIcon*10);
        ctx.fill();

        ctx.fillStyle = 'green';
        ctx.fillRect(GAME_WIDTH/8, GAME_HEIGHT/5*3, GAME_WIDTH/4, GAME_HEIGHT/10);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${sizeIcon*5}px Nova Squre`;
        ctx.fillText("Chapter 3", GAME_WIDTH/8+sizeIcon*1.7, GAME_HEIGHT/5*3+sizeIcon*10);
        ctx.fill();

        ctx.fillStyle = 'orange';
        ctx.fillRect(GAME_WIDTH/8*5, GAME_HEIGHT/5*3, GAME_WIDTH/4, GAME_HEIGHT/10);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${sizeIcon*5}px Nova Squre`;
        ctx.fillText("Chapter 4", GAME_WIDTH/8*5+sizeIcon*1.7, GAME_HEIGHT/5*3+sizeIcon*10);
        ctx.fill();

        let iconBall = new Image();
        iconBall.src = "../img/ball.png";
        ctx.drawImage(iconBall, 0, 0, iconBall.width, iconBall.height, GAME_WIDTH/5, GAME_HEIGHT/10*9, GAME_WIDTH/9, GAME_WIDTH/9);

        let iconBack = new Image();
            iconBack.src = "../img/back.png";
            ctx.drawImage(iconBack, 0, 0, iconBack.width, iconBack.height, GAME_WIDTH/3*2, GAME_HEIGHT/10*9, GAME_WIDTH/9, GAME_WIDTH/9);

        let iconHelp = new Image();
        iconHelp.src = "../img/help.png";
        ctx.drawImage(iconHelp, 0, 0, iconHelp.width, iconHelp.height, GAME_WIDTH/9*3.9, GAME_HEIGHT/10*9, GAME_WIDTH/9, GAME_WIDTH/9);

        if (isBoardLevel) {
            let imgBoardLevel =  new Image();
            imgBoardLevel.src = "../img/boardLevel"+ `${chapterSelected}` + ".png";
            ctx.drawImage(imgBoardLevel, 0, 0, imgBoardLevel.width, imgBoardLevel.height, 
                GAME_WIDTH/8, GAME_HEIGHT/8, GAME_WIDTH/4*3, GAME_HEIGHT/4*3);
        }
}

setInterval(() => {
    draw();
    canvas.addEventListener('mousemove', () => pointer());
    canvas.addEventListener('click', () => mouseClick());
}, 20);