localStorage.setItem("levelSelected", '');
localStorage.setItem("ballColor", 'white');
localStorage.setItem("totalCoin", '0');

var logo = document.getElementById("logo");
logo.play();

setTimeout(() => {
    window.location.assign('html/home.html');
}, 7000);

