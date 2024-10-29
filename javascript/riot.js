var game_started = false;

var player1 = null;
var player2 = null;

var player_1_moving = 0;
var player_2_moving = 0;

var player1_direction = 1;
var player2_direction = 1;

var player1_speed = 1;
var player2_speed = 1

var player1_bullet_y = 0;
var player2_bullet_y = 0;

var player1_jump_power = 1;
var player2_jump_power = 1;

var player1_shoot_mass = 1;
var player2_shoot_mass = 1;

var players_clamp_speed = 7;

var players = {1 : player1, 2 : player2}

var boxes = {};

var bullet1 = null;
var bullet2 = null;

var holding_bullet_1 = false;
var holding_bullet_2 = false;

var powerups = ['bullet', 'scale', 'speed', 'jump'];

var jump_power = -1.1;

var powerup_time = 4;

var scores = {1: 0, 2: 0};

var ko_element;

var ko_audio = new Audio('./audio/ko.mp3');

var pop1_audio = new Audio('./audio/pop1.mp3');
var pop2_audio = new Audio('./audio/pop2.mp3');

var player1_pop = 1;
var player2_pop = 1;

var jump1_audio = new Audio('./audio/jump.mp3');
var jump2_audio = new Audio('./audio/jump.mp3');

function get_bird(){
    player1 = add_entity('player1', [50, 50], [400, 140])
    player1.dynamic = true;
    player1.color(0, 0, 255, 255);

    player2 = add_entity('player2', [50, 50], [1000, 140])
    player2.dynamic = true;
    player2.color(255, 0, 0, 255);
    
}

function init_powerups(player, type){
    if(player == 1){
    if(type == 'speed'){player1_speed = 2;
        setTimeout(() => {player1_speed = 1;}, powerup_time * 1000)}

    if(type == 'bullet'){player1_shoot_mass = 2;
        setTimeout(() => {player1_shoot_mass = 1;}, powerup_time * 1000)}

    if(type == 'scale'){player1.scale(20, 20); player1_bullet_y = -10;
        setTimeout(() => {player1.scale(50, 50);player1.pos.y -= 31; player1_bullet_y = 0;}, powerup_time * 1000)}


    if(type == 'jump'){player1_jump_power = 1.5;
            setTimeout(() => {player1_jump_power = 1;}, powerup_time * 1000)}

    }else{

        if(type == 'speed'){player2_speed = 2;
            setTimeout(() => {player2_speed = 1;}, powerup_time * 1000)}
    
        if(type == 'bullet'){player2_shoot_mass = 2;
            setTimeout(() => {player2_shoot_mass = 1;}, powerup_time * 1000)}
    
        if(type == 'scale'){player2.scale(20, 20); player2_bullet_y = -10;
            setTimeout(() => {player2.scale(50, 50); player2.pos.y -= 31; player2_bullet_y = 0;}, powerup_time * 1000)}

        if(type == 'jump'){player2_jump_power = 1.5;
            setTimeout(() => {player2_jump_power = 1;}, powerup_time * 1000)}

}

}
var g;
function make_power_up(p, pos){
    destroy(g);
    
    g = add_ghost('power_up', [80, 80], pos);
    g.tags = [p];

    if (p == 'jump'){
        g.tex('images/game/jump.png');}

    if (p == 'speed'){
        g.tex('images/game/speed.png');}

    if (p == 'bullet'){
            g.tex('images/game/bullet.png');}

    if (p == 'scale'){
            g.tex('images/game/scale.png');}

}

//get_random_int(0, powerups.length)

var powerup_audio = new Audio('./audio/powerup.mp3');

function play_powerup(){
    powerup_audio.currentTime = 0;
    powerup_audio.play();
}

function check_ghosts(){
    for(item in ghost_objects){
        var ghost = ghost_objects[item];
        if(ghost.collided_entities.includes(player1) == true){
            destroy(ghost);
            //console.log(ghost_objects);
            init_powerups(1, ghost.tags[0]);
            play_powerup();

        }
        if(ghost.collided_entities.includes(player2) == true){
            destroy(ghost);
            //console.log('detroyed power-up');
            init_powerups(2, ghost.tags[0]);
            play_powerup();

        }
    }
}


var bull;
var bull_y = 0;

function play_pop_sound(pop = 1){
    if(pop <= 1.2){
        pop1_audio.currentTime = 0;
        pop1_audio.play();
    }else{pop2_audio.currentTime = 0;pop2_audio.play();}
}

function shoot_bullet(pos, id, color, dir, power = 1){

    if(bullet1 == null && id == 1){
        bullet1 = add_entity('player_b1', [30, 30], [10, 10], true);
        bullet1.mass = 2.5;
    }
    if(bullet2 == null && id == 2)
    {bullet2 = add_entity('player_b2', [30, 30], [10, 10], true);
        bullet2.mass = 2.5;
    }

    if(id == 1){bull = bullet1; bull_y = player1_bullet_y; play_pop_sound(player1_pop);}
    else{bull = bullet2; bull_y = player2_bullet_y; play_pop_sound(player2_pop);}
    bull.pos.x = pos[0];
    bull.pos.y = pos[1] + bull_y;
    bull.velocity.y = 0;
    bull.velocity.x = 20 * dir * power;
    bull.air_friction = 0;
    bull.friction = 0;
    bull.color(color[0], color[1], color[2]);
}

var power_divider = 400;

var score_board = null;
var victory_music = new Audio('./audio/victory.mp3');
var winner = 1;

function complete_end(){
    var end_text = '';
    var el = document.getElementById('winner_screen');

    if(winner == 2){
        end_text = 'Red Wins!';
            el.style.color = 'rgb(255, 0, 0)';
    }
    
    else if(winner == 1){
        end_text = 'Blue Wins!';
        el.style.color = 'rgb(0, 0, 255)';
    }

    el.innerText = end_text;

    document.getElementById('restart').style.visibility =  'visible';
    victory_music.volume = 0;
    victory_music.play();
}

var punch_audio = new Audio('./audio/finish_punch.mp3');

function animate_end(win = 1){
    setTimeout(complete_end, 30);
    return
    punch_audio.play();

    player1.body.style.top = "50%";
    player1.body.style.left = "50%";

    player2.body.style.top = "50%";
    player2.body.style.left = "50%";

    if(win == 1){
        player1.body.style.animation = "end_animation_winner 5s";
        player2.body.style.animation = "end_animation_loser 5s";
    }else{
        player2.body.style.animation = "end_animation_winner 5s";
        player1.body.style.animation = "end_animation_loser 5s";
    }
}

function end_game(win = 1){
    winner = win;
    game_started = false;
    run_physics = false;

    animate_end(win);
    
    
}

var win_score = 5;

function animate_ko(){
    if(scores[2] >= win_score || scores[1] >= win_score){return 0;}

    ko_element = document.createElement('img');
    ko_element.classList.add('ko_image');
    ko_element.src = "./images/game/knockout.gif";
    document.body.appendChild(ko_element);
    ko_element.style.animation = "ko_animation 1.5s";
    ko_audio.play();
}   

setInterval(() => {

    if(game_started == false){return;}
    
    /*
    if(player1.pos.x > 1400 && scores[2] == 4 && player1.velocity.x >  1 
        || 
        player1.pos.x < 0 && scores[2] == 4 && player1.velocity.x < - 1){
        end_game(win = 2);
        return 0;
    }

    if(player2.pos.x > 1400 && scores[1] == 4 && player2.velocity.x >  1 
        || 
        player2.pos.x < 0 && scores[1] == 4 && player2.velocity.x < - 1){
        end_game(win = 1);
        return 0;
    }
        */

    if(scores[1] >= 5){
        end_game(1);
        
    }
    else if(scores[2] >= 5){
        end_game(2);
    }


    if(score_board != null){
        score_board.text(scores[1].toString() + ("\xa0".repeat(50)) + scores[2].toString());
    }


    check_ghosts();

    if(held_keys['d'] == true ){player1.velocity.x = clamp(player1.velocity.x + 4* player1_speed, null, players_clamp_speed * player1_speed); player1_direction = 1;}
    if(held_keys['a'] == true ){player1.velocity.x = clamp(player1.velocity.x - 4 * player1_speed ,  players_clamp_speed * -1 * player1_speed, null); player1_direction = -1;}

    if(held_keys['arrowright'] == true){player2.velocity.x = clamp(player2.velocity.x + 4 * player2_speed,  null, players_clamp_speed * player2_speed); player2_direction = 1;}
    if(held_keys['arrowleft'] == true){player2.velocity.x = clamp(player2.velocity.x - 4 * player2_speed,  players_clamp_speed * -1 * player2_speed, null); player2_direction = -1;}

    if(held_keys['s'] == false && holding_bullet_1 == true)
        {holding_bullet_1 = false;
            player1_pop = clamp(timed_keys['s'] / power_divider, 0, 2);
            shoot_bullet([player1.pos.x + 80 * player1_direction, player1.pos.y], 1, [100, 100, 200], dir = player1_direction, power = player1_pop);
            timed_keys['s'] = 0;}

    
    if(held_keys['arrowdown'] == false && holding_bullet_2 == true)
        {holding_bullet_2 = false;
            player2_pop = clamp(timed_keys['arrowdown'] / power_divider, 0, 2);
            shoot_bullet([player2.pos.x + 80 * player2_direction, player2.pos.y], 2, [200, 100, 100], dir = player2_direction, power = player2_pop);
            timed_keys['arrowdown'] = 0;}



    if(player1.pos.y > 1000){
        player1.pos.y = 100;
        player1.pos.x = 400;
        player1.mass = 100;
        setTimeout(() => {player1.mass = 1;}, 2000)
        player1.velocity.y = 0;
        player1.velocity.x = 0;
        scores[2] += 1;
        animate_ko()
    }

    if(player2.pos.y > 1000){
        player2.pos.y = 100;
        player2.pos.x = 1000;
        player2.velocity.y = 0;
        player2.velocity.x = 0;
        player2.mass = 100;
        setTimeout(() => {player2.mass = 1;}, 2000)
        scores[1] += 1;
        animate_ko()
    }


    
}, 60);

function move_platfrom(obj, speed = 4, time = 20){
    let timed = 0;
    const max = 45;
    setInterval(() => {
        if(timed < max){
            //obj.pos.x += 4;
            obj.velocity.x  = speed;
            timed += 1;
            if(timed >= max){timed = max * 2}
        }
        if(timed > max){
            //obj.pos.x -= 4;
            obj.velocity.x = -speed;
            timed -= 1;
            if(timed <= max){timed = 0;}
        }
          
    },
    time)

}

function move_platfrom_y(obj, speed = 0.5, time = 40){
    let timed = 0;
    const max = 45;
    setInterval(() => {
        if(timed < max){
            //obj.pos.y = 400;
            obj.velocity.y = speed;
            timed += 1;
            if(timed >= max){timed = max * 2}
        }
        if(timed > max){
            //obj.pos.x -= 4;
            obj.velocity.y = -speed;
            timed -= 1;
            if(timed <= max){timed = 0;}
        }
          
    },
    time)

}

function input(){
    document.body.addEventListener("keydown", ({ key }) => {

	    if(game_started == false){return;}
        key = key.toLowerCase();

        if(key == 'w' && player1.collide_checker.bottom == 1){
            player1.velocity.y = jump_power * player1_jump_power;
            jump1_audio.currentTime = 0; jump1_audio.play();}


        if(key == 'arrowup' && player2.collide_checker.bottom == 1){
            player2.velocity.y = jump_power * player2_jump_power;
            jump2_audio.currentTime = 0; jump2_audio.play();}
        

        ////////////


        if(key == 's' && holding_bullet_1 == false || key == 'S' && holding_bullet_1 == false){holding_bullet_1 = true;}
        if(key == 'arrowdown' && holding_bullet_2 == false){holding_bullet_2 = true;}

      });
}

var floors = {};

var start_elements = {};

function level_1(){
    //floors[0] = add_entity('floor1', [1000, 600], [300, 600]);
    floors[1] =add_entity('floor up left', [300, 67], [0, 400]);
    floors[2] =add_entity('floor up right', [300, 67], [1250, 400]);

    floors[3] =add_entity('floor up', [500, 56], [100, 200]);
    floors[4] =add_entity('floor up 2', [500, 56], [900, 200]);

    floors[5] = add_entity('moving floor', [400, 90], [800, 550])
    floors[5].dynamic = true;
    floors[5].velocity_lock = [1, 0];
    floors[5].can_bump = false;
    floors[5].mass = 10;

    floors[6] = add_entity('moving floor2', [400, 90], [200, 550])
    floors[6].dynamic = true;
    floors[6].velocity_lock = [1, 0];
    floors[6].can_bump = false;
    floors[6].mass = 10;

    floors[7] = add_entity('moving floor 3', [90, 90], [700, 100])
    floors[7].dynamic = true;
    floors[7].velocity_lock = [0, 1];
    floors[7].can_bump = false;
    floors[7].mass = 10;

    for(const [key, value] of Object.entries(floors)){
        value.tex('images/game/platform.png');
        value.color(0, 0, 0, 0);
    }

    floors[7].tex('images/game/crate.avif');
    floors[7].color(0, 0, 0, 0);
    floors[7].gravity = 0;

    score_board = add_text('score', 100, [10, 30], 'testing');
    ko_element = document.getElementById("ko");

    for(i in start_elements){
        destroy(start_elements[i]);
    }

    move_platfrom(floors[5], 4, 20);
    move_platfrom(floors[6], 3, 40);
    move_platfrom_y(floors[7]);

}

function load_level(level){
    if(level == 1){
        level_1();
    }

    do_physics();
}


function start_game(){
    const powerups_timer = setInterval(() => 
        {
            var up = powerups[get_random_int(0, powerups.length)]
            make_power_up(up, [get_random_int(200, 1200), get_random_int(0, 500)]);   
            //console.log(up);
        }
        , 5000);


    load_level(1);
    init_key_detection();
    get_bird();
    input();

    document.getElementById('start_button').style.visibility =  'hidden';

    game_started = true;
}

function restart_game(){
    document.getElementById('restart').style.visibility =  'hidden';
    scores[1]  = 0;
    scores[2]  = 0;
    score_board.text(scores[1].toString() + ("\xa0".repeat(50)) + scores[2].toString());
    var el = document.getElementById('winner_screen');
    el.innerText = "";
    //[400, 140]
    //[1000, 140]
    player1.pos.x = 400;
    player1.pos.y = 140;
    player2.pos.x = 1000;
    player2.pos.y = 140;

    run_physics = true;
    game_started = true;
}

