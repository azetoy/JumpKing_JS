let canvas = document.getElementById('game');
let context = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
let ratio = window.devicePixelRatio;

canvas.width = width * ratio;
canvas.height = height * ratio;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';
context.scale(ratio, ratio);
context.imageSmoothingEnabled = false;


const platforms = [];

let start;
let end;


class Obstacle {
    number;
    length;
    random;

    x = 250;
    y = 1000;

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
    y = 850;

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

    move_left() {
        if (!(this.is_falling || this.is_jumping)) {
            this.step++;
            this.direction = "left";
            this.x -= this.speed;
            this.current_move = this.run_left;
        }
    }
    move_right() {
        if (!(this.is_falling || this.is_jumping)) {
            this.step++;
            this.direction = "right";
            this.x += this.speed;
            this.current_move = this.run_right;
        }
    }

    jump() {
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
                this.current_move = this.jump_left;
                this.x -= this.speed;
                this.y -= this.speed;
                this.jumpe_actual++;

            }
        }
        else {
            this.is_jumping = false;
            this.is_falling = true;
        }
    }

    good_run() {
        if (this.direction == "left") {
            this.current_move = this.run_left;
        }
        else
            this.current_move = this.run_right;
    }

    good_jump() {
        if (this.direction == "left") {
            this.current_move = this.jump_left;
        }
        else
            this.current_move = this.jump_right;

    }
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

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
    }

}

function animate() {
    if (!player.want_to_jumpe) {
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
        context.drawImage(platforms[i][2], 16 * 0, 0, 16, 16, platforms[i][0], platforms[i][1], 16, 16);
    }

}

function generate_sol() {

    let x = 0;
    for (let i = 0; i < window.innerWidth / obstacle.sprite_size; i++) {
        platforms.push([x, 1065, obstacle.entity]);
        x += 15;
    }
}

function generate_platforms() {
    let x = 250;
    let y = 950;
    let len;
    for (let i = 0; i < obstacle.number; i++) {

        if (obstacle.random)
            len = getRandom(1, obstacle.length)
        else
            len = obstacle.length;

        for (let j = 0; j < len; j++) {
            platforms.push([x, y, obstacle.entity]);
            x += 15;
        }
        x = Math.round(getRandom(x + 150, x + 200) / 5) * 5;
        y = Math.round(getRandom(y + 50, y - 150) / 5) * 5;
    }
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
            if (!(player.is_jumping || player.is_falling)) {
                player.want_to_jumpe = true;
                if (!player.is_charging) {
                    start = new Date();
                    player.is_charging = true;
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
            if (!(player.is_falling || player.is_jumping)) {
                player.jump();
                player.is_jumping = true;
                player.want_to_jumpe = false;
                end = new Date();
                player.is_charging = false;

                let diff = ((end.getTime() - start.getTime()) / 100);
                player.max_jump += diff;

            }
            break;
        default:
            break;
    }
}

let player = new Player();
player.init_sprite();

let obstacle = new Obstacle(10, 5, true);
obstacle.init_sprite();
obstacle.init_biome();

generate_sol();
generate_platforms();

const callback = setInterval(() => {
    animate();
}, 10);