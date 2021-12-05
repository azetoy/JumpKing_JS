let canvas = document.getElementById('game');
let context = canvas.getContext('2d');

let progress = document.querySelector('.progress-done');
let tmp = getRandom(30, 100)
let acc = 0;
var timer;
progress.style.opacity = 0;

let width = window.innerWidth;
let height = window.innerHeight;
let ratio = window.devicePixelRatio;

canvas.width = width * ratio;
canvas.height = height * ratio;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';
context.scale(ratio, ratio);
context.imageSmoothingEnabled = false;


let platforms = [];

let start;
let end;
let init_game = true
let player;
let obstacle;

let lastplatform = []

// Classe pour initialiser les sprites des obstacles et du biome
class Obstacle {
    number;
    length;
    random;


    sprite_size = 15;

    entity;

    sand = new Image();
    sandStone = new Image();
    dirt = new Image();
    dirt_grass = new Image();

    forest_biome = new Image();
    sand_biome = new Image();


    acutal_biome;

    constructor(number, length, random) {
        this.number = number;
        this.length = length;
        this.random = random;
    }

    init_sprite() {
        this.sand.onload = this.animate;
        this.sand.src = "./sprite_block/CrackedSandStone.png";

        this.sand.onload = this.animate;
        this.sandStone.src = "./sprite_block/SandStone.png";

        this.dirt.onload = this.animate;
        this.dirt.src = "./sprite_block/Dirt.png";

        this.dirt_grass.onload = this.animate;
        this.dirt_grass.src = "./sprite_block/DirtGrass.png";
    }


    //Fonctions pour les biomes (style de texture)
    init_biome() {
        this.forest_biome.src = "./biome/forest_biome.png";
        this.sand_biome.src = "./biome/desert_biome.png";

        if (Math.round((getRandom(0, 1) / 1) * 1)) {
            this.entity = this.sand;
        }
        else
            this.entity = this.dirt_grass;
    }
    select_biome() {

        if (this.entity == (this.sand || this.sandStone))
            this.acutal_biome = this.sand_biome;
        else
            this.acutal_biome = this.forest_biome;
    }
}
//Classe initialisant les sprites du joueur et gère les déplacements
class Player {

    is_jumping = false;
    is_falling = true;
    want_to_jumpe = false;
    is_charging = false;
    is_oofed = false;

    fall_height = 0;
    max_jump = 25;
    jumpe_actual = 0;

    onplatform = false;

    size_sprite = 32;
    x = 250;
    y = Math.round(window.innerHeight - (window.innerHeight * 0.2))

    speed = 5;

    r = 40;
    s = this.r / 12;

    step = 0;

    run_right = new Image();
    run_left = new Image();
    jump_left = new Image();
    jump_right = new Image();
    oof = new Image();
    direction = "right";
    current_move;

    constructor() { }
    // Fonction d'initialisation des sprite
    init_sprite() {

        this.run_right.onload = this.animate;
        this.run_right.src = "./sprite_animation/Run_right.png";

        this.run_left.onload = this.animate;
        this.run_left.src = "./sprite_animation/Run_left.png";

        this.jump_right.onload = this.animate;
        this.jump_right.src = "./sprite_animation/Jump_right.png";

        this.jump_left.onload = this.animate;
        this.jump_left.src = "./sprite_animation/Jump_left.png";

        this.oof.src = "./sprite_animation/Oof.png"

        this.current_move = this.run_right;
    }
    //Mouvements
    move_left() {
        this.check_win()
        if (!(this.is_falling || this.is_jumping)) {
            this.step++;
            this.direction = "left";
            if (this.x - 16 > 0) this.x -= this.speed;
            this.current_move = this.run_left;
        }
    }
    move_right() {
        this.check_win()
        if (!(this.is_falling || this.is_jumping)) {
            this.step++;
            this.direction = "right";
            this.x += this.speed;
            this.current_move = this.run_right;
        }
    }

    jump() {
        this.check_win()
        player.is_oofed = false;
        if (this.jumpe_actual <= this.max_jump) {
            this.step = 1;
            if (this.direction == "right") {
                this.current_move = this.jump_right;
                this.x += this.speed;
                this.y -= this.speed;
                this.jumpe_actual++;

            }
            else {
                if (this.x > 0) {
                    this.current_move = this.jump_left;
                    this.x -= this.speed;
                    this.y -= this.speed;
                    this.jumpe_actual++;
                }

            }
        }
        else {
            this.is_jumping = false;
            this.is_falling = true;
        }
    }
    // Fonction pour gérer l'orientation du joueur 

    good_run() {
        if (this.direction == "left") {
            this.current_move = this.run_left;
        }
        else
            this.current_move = this.run_right;
    }

    // Fonction pour gérer l'orientation du joueur 
    good_jump() {
        if (this.direction == "left") {
            this.current_move = this.jump_left;
        }
        else
            this.current_move = this.jump_right;

    }
    //Vérification de la condition de victoire
    check_win() {
        if (this.x >= window.innerWidth) {
            init_game = true
        }
    }


}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

init()

//Fonction de colision pour savoir si oui ou non le joueur et sur la platforme
function collision() {
    player.onplatform = false;
    player.is_falling = true;
    for (let i = 0; i < platforms.length; i++) {

        if ((player.y == platforms[i][1]) && ((player.x + 38 >= platforms[i][0]) && (player.x - 45 <= platforms[i][0]))) {
            player.onplatform = true;
            player.is_falling = false;
            player.is_jumping = false;
            player.jumpe_actual = 0;
            player.max_jump = 25;
            if (player.fall_height >= 300) {
                player.fall_height = 0;
                player.step = 0;
                player.current_move = player.oof;
                player.is_oofed = true;
            }
            if (!player.is_oofed) {
                player.good_run();
                player.fall_height = 0;
            }
        }
    }
}

function fall() {
    if (player.onplatform == false) {
        player.y++;
        player.step = 2;
        player.fall_height++;
        player.is_falling = true;
        if (player.y > window.innerHeight) {
            player.x = 250
            player.y = Math.round(window.innerHeight - (window.innerHeight * 0.2))
        }
    }

}
//Fonction du gère les animations
function animate() {
    if (!(player.want_to_jumpe)) {
        collision();
        if (player.is_jumping)
            player.jump();

        if (player.is_falling)
            fall();
    }
    else {
        player.good_jump();
        player.step = 0;
    }

    draw();
    update();
}

function draw_biome() {
    obstacle.select_biome();
    context.drawImage(obstacle.acutal_biome, 0, 0, window.innerWidth, window.innerHeight);
}

function draw() {
    context.clearRect(0, 0, width, height);
    draw_biome();
    draw_player();
    draw_platforms();

}

function draw_player() {
    context.drawImage(player.current_move, 32 * player.step, 0, 32, 32, player.x - 16 * player.s, player.y - 32 * player.s, 32 * player.s, 32 * player.s);
}

function update() {
    if (player.step >= 3)
        player.step = 0;
}

function draw_platforms() {
    for (let i = 0; i < platforms.length; i++) {
        context.drawImage(platforms[i][2], 16 * 0, 0, 16, 16, platforms[i][0], platforms[i][1], 32, 32);
    }

}
//Génération des platformes 
function generate_platforms() {
    let x = 250;
    let y = Math.round(window.innerHeight - (window.innerHeight * 0.1))
    let len;
    for (let i = 0; i < obstacle.number; i++) {

        if (obstacle.random)
            len = getRandom(1, obstacle.length)
        else
            len = obstacle.length;

        for (let j = 0; j < len; j++) {
            platforms.push([x, y, obstacle.entity]);
            x += 30;
        }
        x = Math.round(getRandom(x + 150, x + 200) / 5) * 5;
        y = Math.round(getRandom(y + 50, y - 150) / 5) * 5;
    }
}

function up_time() {

    acc += 1;

    progress.setAttribute('data-done', acc);
    progress.style.width = progress.getAttribute('data-done') + '%';
    progress.style.opacity = 1;
    if (acc >= 100)
        clearInterval(timer);
}

//keyboard
window.onkeydown = function (e) {
    var key = e.keyCode || e.which;
    switch (key) {
        case 37:
            player.move_left();
            break;
        case 39:
            player.move_right();
            break;
        case 38:
            if (!(player.is_jumping)) {
                if (!(player.is_falling)) {
                    player.want_to_jumpe = true;
                    if (!player.is_charging) {
                        start = new Date();
                        player.is_charging = true;
                        timer = setInterval(function () {
                            up_time();
                        }, 30)
                    }
                }
            }
            break;
        default:
            break;
    }
}
window.onkeyup = function (e) {
    var key = e.keyCode || e.which;
    switch (key) {
        case 37:
            player.step = 0;
            break;
        case 39:
            player.step = 0;
            break;
        case 38:
            if (!(player.is_falling)) {
                if (!(player.is_jumping)) {
                    player.jump();
                    player.is_jumping = true;
                    player.want_to_jumpe = false;
                    end = new Date();
                    player.is_charging = false;

                    let diff = ((end.getTime() - start.getTime()) / 30);
                    if (diff >= 100) {
                        player.max_jump += 100;
                        clearInterval(timer)
                        acc = 0;
                        progress.style.opacity = 0;
                    }
                    else {
                        player.max_jump += diff;
                        clearInterval(timer)
                        acc = 0;
                        progress.style.opacity = 0;
                    }

                }

            }
            break;
        default:
            break;
    }
}

//Fonction d'initialisation du jeu
function init() {
    init_game = false
    player = new Player();
    player.init_sprite();


    platforms = []

    obstacle = new Obstacle(10, 5, true);
    obstacle.init_sprite();
    obstacle.init_biome();

    generate_platforms();
}

// Permet d'actualiser les animation et de redéssiner un niveau via la variable (init_game)
const callback = setInterval(() => {
    if (init_game) {
        init()
    }
    animate();
    increment();
}, 4);

function increment() {
    let done = false;

    if (acc != Math.floor(tmp)) {
        window.dispatchEvent(new KeyboardEvent('keydown', {
            keyCode: 38
        }));
        if (acc >= Math.floor(tmp))
            done = true;
    }
    if (done) {
        window.dispatchEvent(new KeyboardEvent('keyup', {
            keyCode: 38
        }));
        tmp = getRandom(30, 100)
    }
}
