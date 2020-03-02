let grid = {
    first: { row: 9, column:9, total: 10 },
    second: {row: 9, column: 16, total: 18 },
    third: {row: 16, column: 16, total: 60 }
};
let grid_type = "first";
let row = 9;
let column = 9;
let total = 10;
let lei = 10;
let lei_position = [];
let isOver = true; //判断游戏是否结束
let timer = 0;
let time;
let isTime = false; //判断游戏计时是否开始

// 改变难度
function change_type(current, type) {
    grid_type = type;
    row = grid[type].row;
    column = grid[type].column;
    lei = grid[type].total;
    lei_position = [];
    isOver = true;
    timer = 0;
    clearTimeout(time);
    init_grid();
    document.getElementById('isTime').innerHTML = "开始";
    document.getElementById('timer').innerHTML = "0";
    document.getElementById('game_over').innerHTML = "";
}
// 游戏结束
function gameOver(text) {
    let allLei = document.getElementsByClassName("isLei");
    isOver = true;
    timer = 0;
    clearTimeout(time);
    document.getElementById("game_over").innerHTML = text;
    document.getElementById("isTime").innerHTML = '再玩一局';
    for(let i = 0; i < allLei.length; i++) {
        allLei[i].classList.add('lei');
    }
}
// 左击
function click_left(dom) {
    if(dom && dom.classList.contains('isLei')) {
        let text = "死透了！";
        gameOver(text);
    } else {
        let liArr = dom.getAttribute("id").split("-");
        let posX = +liArr[0];
        let posY = +liArr[1];
        let n = 0; //周围炸弹个数
        for(let i = posX - 1; i <= posX + 1; i++) {
            for(let j = posY - 1; j <= posY + 1; j++) {
                let aroundBox = document.getElementById(i + '-' + j);
                if(aroundBox && aroundBox.classList.contains('isLei')) {
                    n++;
                }
            }
        }
        if(n !== 0) {
            dom.classList.add("checked");
            dom && (dom.innerHTML = n);
        }
        if(n === 0) {
            for(let i = posX - 1; i <= posX + 1; i++) {
                for(let j = posY - 1; j <= posY + 1; j++) {
                    let nearBox = document.getElementById(i + '-' + j);
                    if(nearBox && nearBox != 0) {
                        if(!nearBox.classList.contains("checked")) {
                            nearBox.classList.add("checked");
                            if(nearBox.classList.contains('flag')) nearBox.classList.remove('flag');
                            click_left(nearBox);
                        }
                    }
                }
            }
        }

        let checkedNum = document.getElementsByClassName("checked").length;
        if(checkedNum === (lei_position.length - lei)) {
            let text = "恭喜你，赢了！！！";
            gameOver(text);
        }
    }
}
// 判断鼠标为左击还是右击
function click_li(event, liId) {
    console.log(isOver);
    let elem_id = document.getElementById(liId);
    if(event.button === 0 && !elem_id.classList.contains("flag") && !isOver) {
        click_left(event.target);
    } else if(event.button === 2 && !isOver && !elem_id.classList.contains('checked')) {
        if(elem_id.classList.contains('flag')) {
            elem_id.classList.remove('flag');
        } else {
            elem_id.classList.add('flag');
        }
        // click_right();
    }
}
// 初始化雷的位置
function init_lei() {
    let count = lei;
    while(count > 0) {
        let rand = parseInt(Math.random() * row * column);
        
        if(!document.getElementById(lei_position[rand]).classList.contains('isLei')) {
           
            document.getElementById(lei_position[rand]).className = 'isLei';
            count--;
        }
    }
}
// 开始计时
function init_timer() {
    time = setTimeout(init_timer,1000);
    timer++;
    document.getElementById("timer").innerHTML = timer;
}
// 初始化棋盘
function init_grid() {
    let panel = '';
    for(let i = 0; i < row; i++) {
        panel += "<ul>";
        for(let j = 0; j < column; j++) {
            lei_position.push(i + '-' + j);
            panel += "<li id='" + i + '-' + j + "' onmousedown='click_li(event,&quot;" + i + '-' + j + "&quot;)'></li>";
        }
        panel +="</ul>";
    }
    document.getElementById("grid").innerHTML = panel;
    init_lei();
    // init_timer();
}
function start_game() {
    isTime = !isTime;
    isOver = !isOver;
    let htmlText = document.getElementById("isTime").innerHTML;
    if(htmlText == '开始' || htmlText == '继续') {
        document.getElementById("isTime").innerHTML = '暂停';
        init_timer();
    } else if (htmlText == '暂停') {
        document.getElementById("isTime").innerHTML = '继续';
        clearTimeout(time);
    }  else if(htmlText == '再玩一局') {
        // timer = 0;
        document.getElementById('isTime').innerHTML = "暂停";
        document.getElementById('timer').innerHTML = "0";
        document.getElementById('game_over').innerHTML = "";
        init_grid();
        init_timer();
    }
}
window.oncontextmenu = function(e){
    //取消默认的浏览器自带右键
    e.preventDefault();
}
window.onload = function() {
    init_grid();
}