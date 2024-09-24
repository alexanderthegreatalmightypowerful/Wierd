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

function check_ghosts(){
    for(item in ghost_objects){
        var ghost = ghost_objects[item];
        if(ghost.collided_entities.includes(player1) == true){
            destroy(ghost);
            //console.log(ghost_objects);
            init_powerups(1, ghost.tags[0]);

        }
        if(ghost.collided_entities.includes(player2) == true){
            destroy(ghost);
            //console.log('detroyed power-up');
            init_powerups(2, ghost.tags[0]);

        }
    }
}


var bull;
var bull_y = 0;

function shoot_bullet(pos, id, color, dir, power = 1){

    if(bullet1 == null && id == 1){
        bullet1 = add_entity('player_b1', [30, 30], [10, 10], true);
        bullet1.mass = 2.5;
    }
    if(bullet2 == null && id == 2)
    {bullet2 = add_entity('player_b2', [30, 30], [10, 10], true);
        bullet2.mass = 2.5;
    }

    if(id == 1){bull = bullet1; bull_y = player1_bullet_y;}
    else{bull = bullet2; bull_y = player2_bullet_y;}
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


function end_game(winner = 1){
    var end_text = '';
    var el = document.getElementById('winner_screen');

    if(winner == 2){
        end_text = 'Red Wins!';
            el.style.color = 'rgb(255, 0, 0)'
    }
    
    else if(winner == 1){
        end_text = 'Blue Wins!';
        el.style.color = 'rgb(0, 0, 255)'
    }


    el.innerText = end_text;

}



function animate_ko(){
    ko_element = document.createElement('img');
    ko_element.classList.add('ko_image');
    ko_element.src = "./images/game/knockout.gif";
    document.body.appendChild(ko_element);
    ko_element.style.animation = "ko_animation 1.5s";
    
}   

setInterval(() => {

    if(game_started == false){return;}


    if(scores[1] >= 5){
        end_game(1);
        game_started = false;
        

    }
    else if(scores[2] >= 5){
        end_game(2);
        game_started = false;
        
    }


    if(score_board != null){
        score_board.text(scores[1].toString() + ("\xa0".repeat(50)) + scores[2].toString());
    }


    check_ghosts();

    if(held_keys['d'] == true || held_keys['D'] == true){player1.velocity.x = clamp(player1.velocity.x + 4* player1_speed, null, players_clamp_speed * player1_speed); player1_direction = 1;}
    if(held_keys['a'] == true || held_keys['A'] == true){player1.velocity.x = clamp(player1.velocity.x - 4 * player1_speed ,  players_clamp_speed * -1 * player1_speed, null); player1_direction = -1;}

    if(held_keys['ArrowRight'] == true){player2.velocity.x = clamp(player2.velocity.x + 4 * player2_speed,  null, players_clamp_speed * player2_speed); player2_direction = 1;}
    if(held_keys['ArrowLeft'] == true){player2.velocity.x = clamp(player2.velocity.x - 4 * player2_speed,  players_clamp_speed * -1 * player2_speed, null); player2_direction = -1;}


    if(held_keys['s'] == false && holding_bullet_1 == true)
        {holding_bullet_1 = false;
            shoot_bullet([player1.pos.x + 80 * player1_direction, player1.pos.y], 1, [100, 100, 200], dir = player1_direction, power = clamp(timed_keys['s'] / power_divider, 0, 2));
            timed_keys['s'] = 0;}

    
    if(held_keys['ArrowDown'] == false && holding_bullet_2 == true)
        {holding_bullet_2 = false;
            shoot_bullet([player2.pos.x + 80 * player2_direction, player2.pos.y], 2, [200, 100, 100], dir = player2_direction, power = clamp(timed_keys['ArrowDown'] / power_divider, 0, 2));
            timed_keys['ArrowDown'] = 0;}


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






function input(){

    document.body.addEventListener("keydown", ({ key }) => {

	    if(game_started == false){return;}


        if(key == 'w' && player1.collide_checker.bottom == 1 || key == 'W' && player1.collide_checker.bottom == 1){player1.velocity.y = jump_power * player1_jump_power;}
        if(key == 'ArrowUp' && player2.collide_checker.bottom == 1){player2.velocity.y = jump_power * player2_jump_power;}
        
        if(key == 's' && holding_bullet_1 == false || key == 'S' && holding_bullet_1 == false){holding_bullet_1 = true;}

        if(key == 'ArrowDown' && holding_bullet_2 == false){holding_bullet_2 = true;}

      });
}

var floors = {};

var start_elements = {};

function level_1(){
    floors[0] = add_entity('floor1', [1000, 600], [300, 600]);
    floors[1] =add_entity('floor up left', [300, 50], [0, 400]);
    floors[2] =add_entity('floor up right', [300, 50], [1250, 400]);
    floors[3] =add_entity('floor up', [500, 50], [100, 200]);
    floors[4] =add_entity('floor up 2', [500, 50], [900, 200]);

    for(const [key, value] of Object.entries(floors)){
        value.tex('images/game/platform.png');
        value.color(0, 0, 0, 0);
    }

    score_board = add_text('score', 100, [10, 30], 'testing');
    ko_element = document.getElementById("ko");

    for(i in start_elements){
        destroy(start_elements[i]);
    }

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

