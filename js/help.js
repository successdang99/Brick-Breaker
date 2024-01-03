var canvas = document.getElementById("helpGame");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;
var GAME_HEIGHT = canvas.height;
var GAME_WIDTH = canvas.width;

function getMousePose(event){
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top 
    }
}

function pointer(){
    let mousePos = this.getMousePose(event);
    if (mousePos.x >= GAME_WIDTH*0.37 && mousePos.y >= GAME_HEIGHT*0.95 && 
        mousePos.x <= GAME_WIDTH*0.58 && mousePos.y <= GAME_HEIGHT*0.99) {
            document.body.style.cursor = "pointer";
            return;
        }
    document.body.style.cursor = "auto";
}

function mouseClick(){
    let mousePos = this.getMousePose(event);
    if (mousePos.x >= GAME_WIDTH*0.37 && mousePos.y >= GAME_HEIGHT*0.95 && 
        mousePos.x <= GAME_WIDTH*0.58 && mousePos.y <= GAME_HEIGHT*0.99) {
            return window.location.assign('chapter.html');   
        }
}

function draw() {
    let rulesgame = new Image();
    rulesgame.src = "../img/rulesgame.png";
    rulesgame.onload = () => {
        ctx.drawImage(rulesgame, 0, 0, rulesgame.width, rulesgame.height, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
}

setInterval(() => {
    draw();
    canvas.addEventListener('mousemove', () => pointer());
    canvas.addEventListener('click', () => mouseClick());
}, 20);