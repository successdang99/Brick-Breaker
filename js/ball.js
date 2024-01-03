var canvas = document.getElementById("shop");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;
var GAME_HEIGHT = canvas.height;
var GAME_WIDTH = canvas.width;
var isCheckExit = false;
var textAnnouce = "";
var annouce;

function getMousePose(event){
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top 
    }
}

function pointer(){
    let mousePos = this.getMousePose(event);
    if (!isCheckExit) {
        if (mousePos.x >= GAME_WIDTH*0.07 && mousePos.y >= GAME_HEIGHT*0.4 && 
            mousePos.x <= GAME_WIDTH*0.28 && mousePos.y <= GAME_HEIGHT*0.44) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.4 && mousePos.y >= GAME_HEIGHT*0.4 && 
            mousePos.x <= GAME_WIDTH*0.61 && mousePos.y <= GAME_HEIGHT*0.44) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.73 && mousePos.y >= GAME_HEIGHT*0.4 && 
            mousePos.x <= GAME_WIDTH*0.95 && mousePos.y <= GAME_HEIGHT*0.44) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.07 && mousePos.y >= GAME_HEIGHT*0.6 && 
            mousePos.x <= GAME_WIDTH*0.28 && mousePos.y <= GAME_HEIGHT*0.64) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.4 && mousePos.y >= GAME_HEIGHT*0.6 && 
            mousePos.x <= GAME_WIDTH*0.61 && mousePos.y <= GAME_HEIGHT*0.64) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.73 && mousePos.y >= GAME_HEIGHT*0.6 && 
            mousePos.x <= GAME_WIDTH*0.95 && mousePos.y <= GAME_HEIGHT*0.64) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.07 && mousePos.y >= GAME_HEIGHT*0.79 && 
            mousePos.x <= GAME_WIDTH*0.28 && mousePos.y <= GAME_HEIGHT*0.83) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.4 && mousePos.y >= GAME_HEIGHT*0.79 && 
            mousePos.x <= GAME_WIDTH*0.61 && mousePos.y <= GAME_HEIGHT*0.83) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.73 && mousePos.y >= GAME_HEIGHT*0.79 && 
            mousePos.x <= GAME_WIDTH*0.95 && mousePos.y <= GAME_HEIGHT*0.83) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.08 && mousePos.y >= GAME_HEIGHT*0.94 && 
            mousePos.x <= GAME_WIDTH*0.18 && mousePos.y <= GAME_HEIGHT) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.87 && mousePos.y >= GAME_HEIGHT*0.95 && 
            mousePos.x <= GAME_WIDTH*0.94 && mousePos.y <= GAME_HEIGHT*0.99) {
                document.body.style.cursor = "pointer";
                return;
            }
    } else {
        if (mousePos.x >= GAME_WIDTH*0.29 && mousePos.y >= GAME_HEIGHT*0.57 && 
            mousePos.x <= GAME_WIDTH*0.48 && mousePos.y <= GAME_HEIGHT*0.64) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.52 && mousePos.y >= GAME_HEIGHT*0.56 && 
            mousePos.x <= GAME_WIDTH*0.7 && mousePos.y <= GAME_HEIGHT*0.63) {
                document.body.style.cursor = "pointer";
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.69 && mousePos.y >= GAME_HEIGHT*0.36 && 
            mousePos.x <= GAME_WIDTH*0.77 && mousePos.y <= GAME_HEIGHT*0.44) {
                document.body.style.cursor = "pointer";
                return;
            }
    }
    document.body.style.cursor = "auto";
}

function mouseClick(){
    let mousePos = this.getMousePose(event);
    if (!isCheckExit) {
        let total = parseInt(localStorage.getItem("totalCoin"), 10);
        let color = localStorage.getItem("ballColor");;
        if (mousePos.x >= GAME_WIDTH*0.07 && mousePos.y >= GAME_HEIGHT*0.4 && 
            mousePos.x <= GAME_WIDTH*0.28 && mousePos.y <= GAME_HEIGHT*0.44  && color != 'red') {
                if (total >= 12) {
                    total -= 12;
                    textAnnouce = "You got a new ball!";
                    localStorage.setItem("ballColor", 'red');
                    localStorage.setItem("totalCoin", total.toString());
                } else if (total < 12) {
                    textAnnouce = "You don't have enough coin!";
                    clearTimeout(annouce);
                    annouce = setTimeout( () => {
                        textAnnouce = "";
                    }, 2000);
                }
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.4 && mousePos.y >= GAME_HEIGHT*0.4 && 
            mousePos.x <= GAME_WIDTH*0.61 && mousePos.y <= GAME_HEIGHT*0.44  && color!='rgb(34, 177, 76)') {
                if (total >= 16) {
                    total -= 16;
                    textAnnouce = "You got a new ball!";
                    localStorage.setItem("ballColor", 'rgb(34, 177, 76)');
                    localStorage.setItem("totalCoin", total.toString());
                } else if (total < 16) {
                    textAnnouce = "You don't have enough coin!";
                    clearTimeout(annouce);
                    annouce = setTimeout( () => {
                        textAnnouce = "";
                    }, 2000);
                }
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.73 && mousePos.y >= GAME_HEIGHT*0.4 && 
            mousePos.x <= GAME_WIDTH*0.95 && mousePos.y <= GAME_HEIGHT*0.44 && color!='rgb(255, 242, 0)') {
                if (total >= 24) {
                    total -= 24;
                    textAnnouce = "You got a new ball!";
                    localStorage.setItem("ballColor", 'rgb(255, 242, 0)');
                    localStorage.setItem("totalCoin", total.toString());
                } else if (total < 24) {
                    textAnnouce = "You don't have enough coin!";
                    clearTimeout(annouce);
                    annouce = setTimeout( () => {
                        textAnnouce = "";
                    }, 2000);
                }
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.07 && mousePos.y >= GAME_HEIGHT*0.6 && 
            mousePos.x <= GAME_WIDTH*0.28 && mousePos.y <= GAME_HEIGHT*0.64 && color != 'rgb(0, 0, 255)') {
                if (total >= 30) {
                    total -= 30;
                    textAnnouce = "You got a new ball!";
                    localStorage.setItem("ballColor", 'rgb(0, 0, 255)');
                    localStorage.setItem("totalCoin", total.toString());
                } else if (total < 30) {
                    textAnnouce = "You don't have enough coin!";
                    clearTimeout(annouce);
                    annouce = setTimeout( () => {
                        textAnnouce = "";
                    }, 2000);
                }
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.4 && mousePos.y >= GAME_HEIGHT*0.6 && 
            mousePos.x <= GAME_WIDTH*0.61 && mousePos.y <= GAME_HEIGHT*0.64 && color != 'rgb(128, 0, 255)') {
                if (total >= 25) {
                    total -= 25;
                    textAnnouce = "You got a new ball!";
                    localStorage.setItem("ballColor", 'rgb(128, 0, 255)');
                    localStorage.setItem("totalCoin", total.toString());
                } else if (total < 25) {
                    textAnnouce = "You don't have enough coin!";
                    clearTimeout(annouce);
                    annouce = setTimeout( () => {
                        textAnnouce = "";
                    }, 2000);
                }
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.73 && mousePos.y >= GAME_HEIGHT*0.6 && 
            mousePos.x <= GAME_WIDTH*0.95 && mousePos.y <= GAME_HEIGHT*0.64 && color != 'rgb(255, 174, 201)') {
                if (total >= 48) {
                    total -= 48;
                    textAnnouce = "You got a new ball!";
                    localStorage.setItem("ballColor", 'rgb(255, 174, 201)');
                    localStorage.setItem("totalCoin", total.toString());
                } else if (total < 48) {
                    textAnnouce = "You don't have enough coin!";
                    clearTimeout(annouce);
                    annouce = setTimeout( () => {
                        textAnnouce = "";
                    }, 2000);
                }
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.07 && mousePos.y >= GAME_HEIGHT*0.79 && 
            mousePos.x <= GAME_WIDTH*0.28 && mousePos.y <= GAME_HEIGHT*0.83 && color != 'rgb(255, 201, 14)') {
                if (total >= 62) {
                    total -= 62;
                    textAnnouce = "You got a new ball!";
                    localStorage.setItem("ballColor", 'rgb(255, 201, 14)');
                    localStorage.setItem("totalCoin", total.toString());
                } else if (total < 62) {
                    textAnnouce = "You don't have enough coin!";
                    clearTimeout(annouce);
                    annouce = setTimeout( () => {
                        textAnnouce = "";
                    }, 2000);
                }
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.4 && mousePos.y >= GAME_HEIGHT*0.79 && 
            mousePos.x <= GAME_WIDTH*0.61 && mousePos.y <= GAME_HEIGHT*0.83 && color != 'rgb(38, 255, 255)') {
                if (total >= 82) {
                    total -= 82;
                    textAnnouce = "You got a new ball!";
                    localStorage.setItem("ballColor", 'rgb(38, 255, 255)');
                    localStorage.setItem("totalCoin", total.toString());
                } else if (total < 82) {
                    textAnnouce = "You don't have enough coin!";
                    clearTimeout(annouce);
                    annouce = setTimeout( () => {
                        textAnnouce = "";
                    }, 2000);
                }
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.73 && mousePos.y >= GAME_HEIGHT*0.79 && 
            mousePos.x <= GAME_WIDTH*0.95 && mousePos.y <= GAME_HEIGHT*0.83 && color != 'rgb(64, 128, 128)') {
                if (total >= 52) {
                    total -= 52;
                    textAnnouce = "You got a new ball!";
                    localStorage.setItem("ballColor", 'rgb(64, 128, 128)');
                    localStorage.setItem("totalCoin", total.toString());
                } else if (total < 52) {
                    textAnnouce = "You don't have enough coin!";
                    clearTimeout(annouce);
                    annouce = setTimeout( () => {
                        textAnnouce = "";
                    }, 2000);
                }
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.08 && mousePos.y >= GAME_HEIGHT*0.94 && 
            mousePos.x <= GAME_WIDTH*0.18 && mousePos.y <= GAME_HEIGHT) {
                isCheckExit = true;
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.87 && mousePos.y >= GAME_HEIGHT*0.95 && 
            mousePos.x <= GAME_WIDTH*0.94 && mousePos.y <= GAME_HEIGHT*0.99) {
                return window.location.assign('chapter.html');
            }
    } else {
        if (mousePos.x >= GAME_WIDTH*0.29 && mousePos.y >= GAME_HEIGHT*0.57 && 
            mousePos.x <= GAME_WIDTH*0.48 && mousePos.y <= GAME_HEIGHT*0.64) {
                return window.location.assign('home.html');
            }
        if (mousePos.x >= GAME_WIDTH*0.52 && mousePos.y >= GAME_HEIGHT*0.56 && 
            mousePos.x <= GAME_WIDTH*0.7 && mousePos.y <= GAME_HEIGHT*0.63) {
                isCheckExit = false;
                return;
            }
        if (mousePos.x >= GAME_WIDTH*0.69 && mousePos.y >= GAME_HEIGHT*0.36 && 
            mousePos.x <= GAME_WIDTH*0.77 && mousePos.y <= GAME_HEIGHT*0.44) {
                isCheckExit = false;
                return;
            }
    }
}

function draw(){
    //background
    let backgroundShop = new Image();
    backgroundShop.src = "../img/shop.png";
    ctx.drawImage(backgroundShop, 0, 0, backgroundShop.width, backgroundShop.height,
        0, 0, GAME_WIDTH, GAME_HEIGHT);

    //checkExit
    if (isCheckExit) {
        let exitShop = new Image();
        exitShop.src = "../img/checkexit.png";
        ctx.drawImage(exitShop, 0, 0, exitShop.width, exitShop.height,
            GAME_WIDTH/6, GAME_HEIGHT/3, GAME_WIDTH/3*2, GAME_HEIGHT/3);
    }
    
    //Annouce
    ctx.textAlign = "center";
    ctx.fillStyle = 'black';
    ctx.font = `${GAME_WIDTH/15}px Nova Square`;
    ctx.fillText(textAnnouce, GAME_WIDTH * 0.5, GAME_HEIGHT*0.90);
    ctx.fill();
    

    //coin
    let total = localStorage.getItem("totalCoin");
    ctx.textAlign = "left";
    ctx.strokeStyle =  'rgb(68, 114, 10)';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgb(239, 255, 217)';
    ctx.font = `${GAME_WIDTH/19}px Nova Square`;
    ctx.strokeText(total, GAME_WIDTH * 0.71, 0.985*GAME_HEIGHT, 0.91*GAME_WIDTH);
    ctx.fillText(total, GAME_WIDTH * 0.71, 0.985*GAME_HEIGHT, 0.91*GAME_WIDTH);
    ctx.stroke();
    ctx.fill();
}

setInterval(() => {
    draw();
    canvas.addEventListener('mousemove', () => pointer());
    canvas.addEventListener('click', () => mouseClick());
}, 100);