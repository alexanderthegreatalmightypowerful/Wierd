var bar_rot = 1;
var velocity = 1;
var fps = 60;
var broken = false;
var finished = false;

var force_break = false;

let width = 1;
let time_interval = 200;
var interval;
var interval1;

var restart_time = 1000;

var rot_start_angle = 1;

//class Rectangle {
    //constructor(height, width) {
      //this.height = height;
      //this.width = width;
    //}
//}



function redo_game(){

    const bar = document.querySelector('.bar');
    const counter = document.querySelector('.counter')
    rot_start_angle *= -1;
    bar_rot = rot_start_angle;
    velocity = 1;
    finished = false;
    width = 1;
    force_break = false;

    var element = document.getElementById("loading_bar");
    element.style.rotate = "0deg";

    bar.style.width =  '0%';
    counter.innerHTML = "0%";
    bar.style.backgroundColor = "##304ffe";

    element.style.animation = "restart_bar 1s";

    console.log('refreshed game');

    setTimeout(start_bar, restart_time);
    setTimeout(do_physics, restart_time);
    setTimeout(() => {broken = false;}, restart_time);
}

function do_physics(){
    var element = document.getElementById("loading_bar");
    const physics_runner = setInterval(() => {
        if (bar_rot > 63 || bar_rot < -63 || force_break == true){
            clearInterval(physics_runner);
            if (bar_rot > 0){element.style.animation = "bar_slide_right 2s";}
            else{element.style.animation = "bar_slide_left 2s";}
            broken = true;
            clearInterval(interval1);
            setTimeout(redo_game, 2000);
        }
        else{
        bar_rot *= (1.025 * velocity);
        element.style.rotate = bar_rot.toString() + "deg";
        }
    }, 1000 / fps);
}

function move_bar(pos = 1){
    var move_amount = 4 * pos;
    var counter = 0;
    var count_amount = 10;
    var element = document.getElementById("loading_bar");
    const mover = setInterval(() => {
        if (counter > count_amount){
            clearInterval(mover);
        }
        else{
        if (bar_rot < 64 || bar_rot > -64){
        move_amount *= 0.85;
        bar_rot += move_amount;
        }
        counter += 1;
        }
    }, 1000 / fps);
}

document.onkeydown = function (e) {
    if(broken == true){return;}
    console.log(e['key']);
    var key = e['key'];
    //if(key == 'a'){bar_rot -= 10;}
    //if(key == 'd'){bar_rot += 10;}

    if(key == 'a'){move_bar(-1);}
    if(key == 'd'){move_bar(1);}

    var element = document.getElementById("loading_bar");
    element.style.rotate = bar_rot.toString() + "deg";
  };

function start_bar() {
    const bar = document.querySelector('.bar');
    const success = document.querySelector('.success')
    const counter = document.querySelector('.counter')

        interval1 = setInterval(() => {
                if (width >= 100) {
                    //success.innerHTML = 'Dowload completed!'
                    bar.style.backgroundColor = "#00ff0f";
                    shake();
                    clearInterval(interval1);
                    setTimeout(() => {testing(); delete interval;}, 2000);
                    delete interval;
                } else {
                    width++;
                    bar.style.width = width + '%';
                    counter.innerHTML = width + '%';
                    velocity = 1 + (width / 2500);
                    
                    if(width > 97){
                        if(bar_rot > 0){move_bar(1);}else{move_bar(-1);}
                    }

                }
            }, time_interval);
        }