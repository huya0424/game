let grid = {
    first: { row: 9, column:9, total: 10 },
    second: {row: 9, column: 16, total: 18 },
    third: {row: 16, column: 16, total: 99 }
};
let grid_type = "first";
let row = 9;
let column = 9;
let total = 10;
let lei = 10;
let lei_position = [];
let isOver = false; //判断游戏是否结束
let timer = 0;
let time;

function change_type(current, type) {
    grid_type = type;
    row = grid[type].row;
    column = grid[type].column;
    lei = grid[type].total;
    lei_position = [];
    isOver = false;
    timer = 0;
    clearTimeout(time);
    init_grid();
}

function gameOver(text) {
    let allLei = document.getElementsByClassName("isLei");
    isOver = true;
    clearTimeout(time);
    document.getElementById("timer").innerHTML = text;
    for(let i = 0; i < allLei.length; i++) {
        allLei[i].classList.add('lei');
    }
}

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

function click_li(event, liId) {
    let elem_id = document.getElementById(liId);
    if(event.button === 0 && !elem_id.classList.contains("flag") && !isOver) {
        click_left(event.target);
    } else if(event.button === 2 && !isOver) {
        if(elem_id.classList.contains('flag')) {
            elem_id.classList.remove('flag');
        } else {
            elem_id.classList.add('flag');
        }
        // click_right();
    }
}

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
function init_timer() {
    time = setTimeout(init_timer,1000);
    timer++;
    document.getElementById("timer").innerHTML = timer;
}

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
    init_timer();
}
window.oncontextmenu = function(e){
    //取消默认的浏览器自带右键
    e.preventDefault();
}
window.onload = function() {
    init_grid();
}