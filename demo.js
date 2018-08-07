var content = document.getElementsByClassName('main-content')[0];
var snakeMove;
var speed = 200;
// 是否可以点击startbtn
var startGameBool = true;
//加个锁，改变start的背景图片及相关联的开始运动还是暂停
var isPauseBool = true;
var oSpan = document.getElementById('score');
var oScore = document.getElementsByClassName('alertscore')[0],
    oClose = document.getElementsByClassName('close')[0],
    oStart = document.getElementById('start'),
    begin = document.getElementsByClassName('start')[0],
    oBtn = document.getElementsByClassName('startbtn')[0],
    oLoser = document.getElementsByClassName('loser')[0];

init();
function init() {
    this.mapW = parseInt(getComputedStyle(content).width);
    this.mapH = parseInt(getComputedStyle(content).height);
    this.foodW = 20;
    this.foodH = 20;
    this.snakeW = 20;
    this.snakeH = 20;
    this.score = 0;
    this.snakeBody = [[3, 1, "head"], [2, 1, "body"], [1, 1, "body"]];
    this.direct = 'right';
    this.right = false;
    this.left = false;
    this.up = true;
    this.down = true;
    bindEvent();
}
function start() {
    begin.style.display = 'none';
    oStart.style.display = "block";
    food();
    snake();

}



function food() {
    var food = document.createElement('div');
    food.style.width = this.foodW + 'px';
    food.style.height = this.foodH + 'px';
    food.style.position = "absolute";
    this.foodX = Math.floor(Math.random() * (this.mapW / 20));
    this.foodY = Math.floor(Math.random() * (this.mapH / 20));
    food.style.left = this.foodX * 20 + 'px';
    food.style.top = this.foodY * 20 + 'px';
    food.classList.add('apple');
    content.appendChild(food);
}

function snake() {
    var len = this.snakeBody.length;
    for (var i = 0; i < len; i++) {
        var snake = document.createElement('div');
        snake.style.width = this.snakeW + 'px';
        snake.style.height = this.snakeH + 'px';
        snake.style.position = "absolute";
        snake.style.left = this.snakeBody[i][0] * 20 + 'px';
        snake.style.top = this.snakeBody[i][1] * 20 + 'px';
        content.appendChild(snake).classList.add('snake', this.snakeBody[i][2]);
        // snake.classList.add('snake');
        // snake.classList.add(this.snakeBody[i][2]);
        switch (this.direct) {
            case "right":
                break;
            case "down":
                snake.style.transform = 'rotate(90deg)'
                break;
            case "left":
                snake.style.transform = 'rotate(180deg)'
                break;
            case "up":
                snake.style.transform = 'rotate(270deg)'
                break;
        }
    }

}
function move() {
    var len = this.snakeBody.length;
    for (var i = len - 1; i > 0; i--) {
        this.snakeBody[i][0] = this.snakeBody[i - 1][0];
        this.snakeBody[i][1] = this.snakeBody[i - 1][1];
    }
    switch (this.direct) {
        case "right":
            this.snakeBody[0][0] += 1;
            break;
        case "down":
            this.snakeBody[0][1] += 1;
            break;
        case "left":
            this.snakeBody[0][0] -= 1;
            break;
        case "up":
            this.snakeBody[0][1] -= 1;
            break;
        default:
            break;
    }
    //移动的时候把之前的清除 重新渲染新的
    removeClass('snake');
    snake();

    if (this.snakeBody[0][0] == this.foodX &&
        this.snakeBody[0][1] == this.foodY) {
        var snakeEndX = this.snakeBody[len - 1][0];
        var snakeEndY = this.snakeBody[len - 1][1];
        switch (this.direct) {
            case "right":
                this.snakeBody.push([snakeEndX - 1, snakeEndY, 'body']);
                break;
            case "down":
                this.snakeBody.push([snakeEndX, snakeEndY - 1, 'body']);
                break;
            case "left":
                this.snakeBody.push([snakeEndX + 1, snakeEndY, 'body']);
                break;
            case "up":
                this.snakeBody.push([snakeEndX, snakeEndY + 1, 'body']);
                break;
        }
        this.score += 1;
        oSpan.innerHTML = this.score;
        removeClass('apple');
        food();
    }
    if (this.snakeBody[0][0] < 0 || this.snakeBody[0][0] > this.mapW / 20 ||
        this.snakeBody[0][1] < 0 || this.snakeBody[0][1] > this.mapH / 20) {
        reloadGame();
    }
    var snakeHX = this.snakeBody[0][0],
        snakeHY = this.snakeBody[0][1];
    for (var i = 1; i < len; i++) {
        if ((snakeHX === this.snakeBody[i][0]) && (snakeHY === this.snakeBody[i][1])) {
            reloadGame();
        }

    }
}


function reloadGame() {
    removeClass('apple');
    removeClass('snake');
    clearInterval(snakeMove);
    this.snakeBody = [[3, 1, "head"], [2, 1, "body"], [1, 1, "body"]];
    this.direct = 'right';
    this.right = false;
    this.left = false;
    this.up = true;
    this.down = true;
    oLoser.style.display = "block";
    oScore.innerHTML = this.score;
    this.score = 0;
    oSpan.innerHTML = this.score;
    startGameBool = true;
    isPauseBool = true;
}

function removeClass(className) {
    var ele = document.getElementsByClassName(className);
    //用循环清除自身
    while (ele.length > 0) {
        // ele[0].parentNode.removeChild(ele[0]);
        ele[0].remove()
    }

}
function bindEvent() {

    oClose.onclick = function () {
        oLoser.style.display = 'none';
        oStart.setAttribute('src', 'images/start.png')
    }
    oBtn.onclick = function () {
        startAndPause();
    }
    oStart.onclick = function () {
        startAndPause();
    }
}
function startAndPause() {
    if (isPauseBool) {
        if (startGameBool) {
            start();
            startGameBool = false;
        }
        oStart.setAttribute('src', 'images/pause.png');
        document.onkeydown = function (e) {
            var code = e.keyCode;
            setDirect(code);
        }
        snakeMove = setInterval(function () {
            move();
        }, speed)

        isPauseBool = false;
    } else {
        oStart.setAttribute('src', 'images/start.png');
        clearInterval(snakeMove);
        document.onkeydown = function (e) {
            e.returnValue = false;
            return false;
        };
        isPauseBool = true;
    }



}

function setDirect(code) {
    switch (code) {
        case 37:
            if (this.left) {
                this.direct = 'left';
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            }
            break;
        case 38:
            if (this.up) {
                this.direct = 'up';
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            }
            break;
        case 39:
            if (this.right) {
                this.direct = 'right';
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            }
            break;
        case 40:
            if (this.down) {
                this.direct = 'down';
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            }
            break;
    }
}