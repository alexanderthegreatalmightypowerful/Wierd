class Vec2{
    constructor(x, y) {
    this.x = x;
    this.y = y;
    }
}

class collide_checker{
    constructor(right, left, top, bottom) {
    this.right = right;
    this.left = left;
    this.top = top;
    this.bottom = bottom;
    }
}

class collider{
    constructor(right, left, top, bottom) {
    this.right = right;
    this.left = left;
    this.top = top;
    this.bottom = bottom;
    }
}



class text_entity{
    constructor(){
        this._text = "";
        this._scale = 10;
        this.pos = new Vec2(0, 0);
        this.rotation = 0;
        this.body = null;
        this.id = '';
    }

    scale(val = 10){
        this.body.style.fontSize = val.toString() + 'px';
        this._scale = val;
    }

    rotation(val = 0){
        this.body.style.rotate = val;
        this.rot = val;
    }

    color(r, g, b, a = 255){
        this.body.style.color = `rgba(${r}, ${g}, ${b}, ${a})`;
    }


    text(val = ""){
        this.body.innerText = val;
        this._text = val;
    }


}

class entity{
    constructor(){
        this.pos = new Vec2(0, 0);
        this.collider = new Vec2(10, 10);
        this.collide_checker = new collide_checker(0, 0, 0, 0);
        this.velocity = new Vec2(0, 0);
        this.id = 'None';
        this.body = null;
        this.dynamic = false;
        this.air_friction = 0.03;
        this.friction = 0.1;
        this.mass = 1;
        this.texture = null;


    }

    color(r, g, b, a = 255){
        this.body.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    color2(r, g, b, a = 255){
        this.body.style.color = `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    tex(path){
        var pth = "url('" + path + "')";
        //console.log(pth);
        this.body.style.backgroundImage = pth; 
    }

    scale(x, y){
        this.body.style.width = x.toString() + 'px';
        this.body.style.height = y.toString() + 'px';

        this.collider.x = x;
        this.collider.y = y;
    }
}

class ghost{
    constructor(){
        this.pos = new Vec2(0, 0);
        this.collider = new Vec2(10, 10);
        this.collided = false;
        this.collided_entities = [];
        this.texture = null;
        this.id = null;
        this.body = null;
        this.tags = [];
    }

    color(r, g, b, a = 255){
        this.body.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    tex(path){
        var pth = "url('" + path + "')";
        //console.log(pth);
        this.body.style.backgroundImage = pth; 
    }
}




function return_element(id){
    var element = document.getElementById(id);
    console.log('element: ' + element);
    return element;
}


const game_objects = [];
const ghost_objects = [];
const text_objects = [];
const visual_objects = [];

var held_keys = {'w': false, 'd': false, "a" : false};
var timed_keys = {};

var gravity = -10
var fps = 60;
var v_middle = 0.1;
var gravity_mult = 0.025;


//0.025;

var world_offset = new Vec2(0, 40);



function dynamic_knock(obj, velocity = [null, null]){
    if(obj.dynamic == false){return;}
    if(velocity[0] != null){
    obj.velocity.x += velocity[0];}

    if(velocity[1] != null){
    obj.velocity.y += velocity[1];}
}


function calculate_x_pos_colliders(col, n){
    var next = col.velocity.x * (1 - (col.air_friction)) * (1 - 0);
    for(other in game_objects){
        if (game_objects[other] != col){
            var n = game_objects[other];


    if(col.pos.y < n.pos.y + n.collider.y  && col.pos.y + col.collider.y  > n.pos.y 
        && col.pos.x - 1 + next < n.pos.x + n.collider.x && col.pos.x + col.collider.x > n.pos.x 
        && col.velocity.x < 0
    ){

        dynamic_knock(n, [col.velocity.x * (col.mass / n.mass), null]);
        col.velocity.x = 0;
        if(n.dynamic == true){
            n.velocty = new Vec2(col.velocity.x, col.velocity.y);
        }
    }


    if(col.pos.y < n.pos.y + n.collider.y    && col.pos.y + col.collider.y  > n.pos.y 
        && col.pos.x + col.collider.x + next + 1 > n.pos.x  && col.pos.x + next < n.pos.x
        && col.velocity.x > 0
    ){

        dynamic_knock(n, [col.velocity.x * (col.mass / n.mass), null]);
        //console.log("right collision");
        col.velocity.x = 0;

        if(n.dynamic == true){
            n.velocty = new Vec2(col.velocity.x, col.velocity.y);
        }
        //col.pos.x = n.pos.x - col.collider.x;
    }

      }
    }

}

async function calculate_colliders(col){
    var collided_bottom = false;
    var collided_top = false;
    var next = (-gravity * (col.velocity.y + gravity_mult));
            for(other in game_objects){
                if (game_objects[other] != col){
                    var n = game_objects[other];

                    if(col.pos.y < n.pos.y + n.collider.y && col.pos.y + col.collider.y + next + 1 > n.pos.y 
                        && col.pos.x + col.collider.x > n.pos.x && col.pos.x < n.pos.x + n.collider.x
                    ){
                        col.collide_checker.bottom = 1;
                        collided_bottom = true;

                        
                        if(col.pos.y < n.pos.y + n.collider.y && col.pos.y + col.collider.y > n.pos.y 
                        && col.pos.x + col.collider.x > n.pos.x && col.pos.x < n.pos.x + n.collider.x
                        ){
                        col.pos.y = n.pos.y - col.collider.y - 1;
                        }
                    }

                    if(col.pos.y + next - 1 < n.pos.y + n.collider.y  && col.pos.y + col.collider.y > n.pos.y
                        && col.pos.x + col.collider.x > n.pos.x && col.pos.x < n.pos.x + n.collider.x
                        
                    ){ 
                        col.collide_checker.top = 1;
                        collided_top = true;

                        if(col.pos.y < n.pos.y + n.collider.y  && col.pos.y + col.collider.y > n.pos.y
                        && col.pos.x + col.collider.x > n.pos.x && col.pos.x < n.pos.x + n.collider.x
                        
                        ){ 
                        col.pos.y = n.pos.y + n.collider.y + 1;

                        }
                    }
                }
    }

    if(collided_bottom == false){col.collide_checker.bottom = 0;}
    if(collided_top == false){col.collide_checker.top = 0;}
}


async function calculate_velocty_x(obj){
    var fric = 0;
    obj.body.style.left = obj.pos.x.toString() + 'px';
    if(obj.collide_checker.bottom == 1){fric = obj.friction;}
    obj.velocity.x *= (1 - (obj.air_friction)) * (1 - fric);
    calculate_x_pos_colliders(obj);
    obj.pos.x += obj.velocity.x;   
}

function removeItemAll(arr, value) {
    var new_array = [];
    for(i in arr){
        if(arr[i] != value){
            new_array.push(arr[i]);
        }
    }
    //console.log(new_array);
    return new_array;
  }

function calculate_ghosts(){
    for(item in ghost_objects){
        var col = ghost_objects[item];
        //console.log(col.collided_entities);
        for(other in game_objects){

            var n = game_objects[other];

            if(col.pos.y < n.pos.y + n.collider.y && col.pos.y + col.collider.y > n.pos.y 
                && col.pos.x + col.collider.x > n.pos.x && col.pos.x < n.pos.x + n.collider.x){
                col.collided = true;
                if(col.collided_entities.includes(n) == false){
                    col.collided_entities.push(n);
                //console.log(col.collided_entities);
            }
            
            } else if(col.collided_entities.includes(n) == true){col.collided_entities = removeItemAll(n.collided_entities, n);}


            }  
            if(col.collided_entities == []){
                col.collided = false;
            }
}

}



async function do_dynamic_physics(){
    for(item in game_objects){
    var obj = game_objects[item];
    if(obj.dynamic == true){

    await calculate_colliders(obj);
    await calculate_velocty_x(obj);

    //console.log(obj.pos);

    if (obj.velocity.y < gravity * -1){
    obj.velocity.y += gravity_mult;}
    if(obj.velocity.y > 0 && obj.collide_checker.bottom == 1){obj.velocity.y = 0;}
    if(obj.velocity.y < 0 && obj.collide_checker.top == 1){obj.velocity.y = 0;}
    obj.pos.y -= gravity * (obj.velocity.y);
   // obj.body.style.top = obj.pos.y.toString() + 'px';
}}
}

function update_visuals(){
    for(item in text_objects){
        var text = text_objects[item];
        text.body.style.top = text.pos.y.toString() + 'px';
        text.body.style.left = text.pos.x.toString() + 'px';

    }
}

async function do_physics(){
    const physics_runner = setInterval(() => 
        {
            update_visuals();
            if(ghost_objects != []){
            calculate_ghosts();}


            for(item in game_objects){
            
            let obj = game_objects[item];
            if(obj.dynamic == true){
        
            calculate_colliders(obj);
            calculate_velocty_x(obj);
        
            if (obj.velocity.y < gravity * -1){
            obj.velocity.y += gravity_mult;}
            if(obj.velocity.y > 0 && obj.collide_checker.bottom == 1){obj.velocity.y = 0;}
            if(obj.velocity.y < 0 && obj.collide_checker.top == 1){obj.velocity.y = 0;}
            obj.pos.y -= gravity * (obj.velocity.y);
            obj.body.style.top = obj.pos.y.toString() + 'px';
        }}} 
    , 1000 / fps);
}



function add_entity(id, col, position, dynamic = false){
    var world = document.getElementById('level');
    var world_string = world.innerHTML;
    //console.log(world_string);
    if(document.getElementById(id) == null){
        var new_entity = "<div class = 'entity' id = '" + id +  "'></div>\n";
        world_string += new_entity;
        //world.innerHTML = world_string;
        var el = document.createElement('div');
        el.classList.add('entity');
        el.id = id;
        world.appendChild(el);
    }

    var object = new entity();
    object.collider = new Vec2(col[0], col[1]);
    object.pos = new Vec2(position[0], position[1]);
    object.body = return_element(id);
    object.body.style.top = object.pos.y.toString() + 'px';
    object.body.style.left = object.pos.x.toString() + 'px';

    object.body.style.width = col[0].toString() + 'px';
    object.body.style.height = col[1].toString() + 'px';

    object.dynamic = dynamic;
    object.id = id;

    game_objects.push(object);


    return object;
}


function add_ghost(id, col, position){
    var world = document.getElementById('level');
    var world_string = world.innerHTML;
    //console.log(world_string);
    if(document.getElementById(id) == null){
        var new_entity = "<div class = 'ghost' id = '" + id +  "'></div>\n";
        world_string += new_entity;
        //world.innerHTML = world_string;
        var el = document.createElement('div');
        el.classList.add('ghost');
        el.id = id;
        world.appendChild(el);
    }

    var object = new ghost();
    object.collider = new Vec2(col[0], col[1]);
    object.pos = new Vec2(position[0], position[1]);
    object.body = return_element(id);
    object.body.style.top = object.pos.y.toString() + 'px';
    object.body.style.left = object.pos.x.toString() + 'px';

    object.body.style.width = col[0].toString() + 'px';
    object.body.style.height = col[1].toString() + 'px';

    object.id = id;

    ghost_objects.push(object);

    return object;
}

function add_text(id, scale, position, text = ""){
    var world = document.getElementById('level');
    var world_string = world.innerHTML;
    //console.log(world_string);
    if(document.getElementById(id) == null){
        var new_entity = "<div class = 'text' id = '" + id +  "'></div>\n";
        world_string += new_entity;
        //world.innerHTML = world_string;
        var el = document.createElement('div');
        el.classList.add('text');
        el.id = id;
        world.appendChild(el);
    }

    var object = new text_entity();
    object.pos = new Vec2(position[0], position[1]);
    object._scale = scale;

    object.body = return_element(id);
    object.body.style.top = object.pos.y.toString() + 'px';
    object.body.style.left = object.pos.x.toString() + 'px';

    object.body.style.fontSize = scale.toString() + 'px';

    object.id = id;
    object.text(text);

    text_objects.push(object);

    return object;
}


function init_key_detection(){
    const signalKeypressDuration = (key, duration) => {
        //console.log(`Key ${key} pressed for ${duration} ms`);
        timed_keys[key] = duration;
      };

      document.body.addEventListener("keydown", ({ key }) => {
        //timed_keys[key] = 0;
        if (!timed_keys[key]) timed_keys[key] = Date.now();
        try{held_keys[key] = true;
            }catch(e){}
      });
      document.body.addEventListener("keyup", ({ key }) => {
        //console.log(key);
        signalKeypressDuration(key, Date.now() - timed_keys[key]);
        try{
        held_keys[key] = false;
        }catch(e){}
      });

}


function texture_entity(obj, texture){
    try{}
    catch(e){alert(e);}
}

function scale_entity(obj, scale){
    try{obj.body.style.width = scale[0].toString() + "px";
        obj.body.style.height = scale[1].toString() + "px";
    }
    catch(e){alert(e);}
}

function destroy(obj){
    try{



        obj.body.remove()
        obj.collider.x = 0;
        obj.collider.y = 0;

        if(obj instanceof ghost){
            for(i = 0; i < ghost_objects.length; i++){
                if(ghost_objects[i] == obj){
                ghost_objects.splice(i, 1);
                break;
                }
            }
        }
        
        delete obj;


    }catch(e){}
}

function clear_scene(){
    for(item in game_objects){
        destroy(game_objects[item]);
    }
}


function get_random_int(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }


class Func{
    constructor(func, ...kwargs){
        this.funcs = kwargs;
        this.func = func;

    }

    execute(){
        this.func(this.funcs);
    }

}


function clamp(value = 0, min = null, max = null){
    if(max != null && value > max){
        value = max;
    }

    if(min !=  null && value < min){
        value = min;
    }

    return value;
}

