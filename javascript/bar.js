var bar_string = "<div class = 'container2'><button onclick = change_page('free_robux.html') class = 'menu_button'>THE WHEEL!</button><button onclick = change_page('free_vbucks.html') class = 'menu_button'>BALANCE THE POLE!</button>" 
                + "<button onclick = change_page('free_riot_points.html') class = 'menu_button'>2 PLAYER SUMO!</button><button onclick = change_page('index.html') class = 'menu_button'>HOME?</button>"
                + '</div>';


function take_bar(){
    var element = document.getElementById('TOP_BAR');
    bar_string = element.innerHTML;
    console.log('set the bar in: ' + bar_string);
}

function set_bar(){
    var element = document.getElementById('TOP_BAR');
    element.innerHTML = bar_string;
    console.log('set the bar in: ' + bar_string);
}

function change_page(link){
    window.location.href = link;
}


