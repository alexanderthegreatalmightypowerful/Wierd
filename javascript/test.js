

//https://www.youtube.com/watch?v=dQw4w9WgXcQ
function testing(){
    console.log("this function is running");
    var video = document.getElementById('rick_video');
    video.style.width = "100%";
    video.play()
    //window.location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
}

var do_shake = true;
var minterval;

function shake(){
    var shake_duration = 15;
    var fill_shake = 0;
    var html = document.getElementById('body');
    var shake_multiplier_y = [];
    var shake_multiplier_x = [];

    

    for(var i = 0; i < 100; i++){

    const min = -1;
    const max = 1;

    var total = Math.random() * (max - min) + min;
    shake_multiplier_x.push(total);

    var total = Math.random() * (max - min) + min;
    shake_multiplier_y.push(total);
    }

    minterval = setInterval(() => {
        if (fill_shake >= 50) {
            clearInterval(minterval);
            html.style.margin =  "0px 0px 0px 0px";

        } else {
            fill_shake++;
            var num = Math.round(200 * shake_multiplier_x[fill_shake]);
            var num2 = Math.round(200 * shake_multiplier_y[fill_shake]);
            if (do_shake == true){html.style.margin =  num.toString() + "px 50px 50px " + num2.toString() + "px";}
            
            
        }
    }, shake_duration);
}



let width = 1;
let time_interval = 20;
var interval
function start() {
    const bar = document.querySelector('.bar');
    const success = document.querySelector('.success')
    const counter = document.querySelector('.counter')

        interval = setInterval(() => {
                if (width >= 100) {
                    //success.innerHTML = 'Dowload completed!'
                    bar.style.backgroundColor = "#00ff0f";
                    shake();
                    clearInterval();
                    setTimeout(() => {testing(); delete interval;}, 2000);
                    delete interval;
                } else {
                    width++;
                    bar.style.width = width + '%';
                    counter.innerHTML = width + '%';
                }
            }, time_interval);
        }

