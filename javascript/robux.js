
var to_rotate = 335 * 3;
var rotation = 1;
var rot_speed = 10;
var finish_rot =false;
var virus_mode = 0;
var audio = new Audio('./audio/swoosh.mp3');
var played = false;



function randint(min, max) {
    return Math.random() * (max - min) + min;
  }


function play_win(){
    document.getElementById('win_screen').style.animation="fade_in 3s";
    document.getElementById('win_button').style.visibility = "visible";
}

function open_winscreen(){
    var win = document.getElementById('win_screen');
    win.style.width = '100%';
    play_win();
    played = false;
    document.body.style.backgroundImage = 'url(./images/winner.gif)';
}


function open_loser(){
    //var win = document.getElementById('win_screen');
    //win.style.width = '100%';
    //play_win();
    played = false;
    document.body.style.backgroundImage = 'url(./images/loser.gif)';
}

function rotate_wheel(){
    var mult = randint(0.1, 5); 
    
    rot_speed = mult * 5;
    console.log(rot_speed);
    rot_max = rot_speed;
    to_rotate = 335;
    var wheel = document.getElementById('spin_wheel');
    var time_interval = 10;


    if(played == false){
        played = true;
    audio.play();}

        interval = setInterval(() => {
                if (finish_rot == true) {
                    var rot = rotation % 360;
                    console.log(rot);
                    if(rot >= 0 && rot < 60 ||
                        rot >= 60 && rot < 120 ||
                        rot >= 180 && rot < 240  ||
                        rot >= 240 && rot < 300
                    ){
                    open_winscreen();
                    }
                    else{open_loser();}
                    clearInterval();
                } else {
                    if (rot_speed > 0.1){
                    rot_speed *= 0.99;
                    rotation += rot_speed;
                    wheel.style.rotate = rotation.toString() + "deg";
                }else{finish_rot = true;}

                }
            }, time_interval);
        }


function download_virus(){
    //https://i.pinimg.com/originals/a3/39/d1/a339d1f7e5fa1b58f49ad83abbfd9aac.gif
    var a = document.createElement('a');
    a.href = "https://i.pinimg.com/originals/a3/39/d1/a339d1f7e5fa1b58f49ad83abbfd9aac.gif";
    a.download = "output.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}
