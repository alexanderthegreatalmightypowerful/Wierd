
var to_rotate = 335 * 3;
var rotation = 1;
var rot_speed = 10;
var finish_rot =false;

//   body.style.background-image: url('../images/robux_bg.jpg');


function play_win(){
    document.getElementById('win_screen').style.animation="fade_in 3s";
    document.getElementById('win_button').style.visibility = "visible";
}

function open_winscreen(){
    var win = document.getElementById('win_screen');
    win.style.width = '100%';
    play_win();
}

function rotate_wheel(){
    var wheel = document.getElementById('spin_wheel');
    var time_interval = 10;
    //x**2 / 2

        interval = setInterval(() => {
                if (finish_rot == true) {
                    clearInterval();
                    open_winscreen();
                } else {
                    if (rot_speed > 0.1){
                    rot_speed *= 0.99;
                    rotation += rot_speed;
                    wheel.style.rotate = rotation.toString() + "deg";
                }else{finish_rot = true;}

                }
            }, time_interval);
        }
