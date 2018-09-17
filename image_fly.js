
// Create app namespace
var app = app || {};
window.app = app;
app.CLEAR_COLOR_FILL = '#000000';

var imageList = ["3.png", "5.png", "11.png", "6.png", "7.png", "8.png", "9.png", "10.png"]


///////////// class Sprite start here //////////////////

function Sprite(imageName){
    this.img = new Image();
    this.img.src = imageName;
    this.position = { x:0, y:0 };
    this.speed = { x:0, y:0 };
    this.restart();
}

Sprite.State = { "Idle": 0, "Move": 1, "FlyAway":2 }

Sprite.prototype.restart = function() {
    this.state = Sprite.State.Idle;
    this.pastTime = 0;
    this.delay = Math.random() * 10000 + 5000;
    this.position.y = (Math.random() + 0.03) * app.canv.height * 0.85; // keep image not too close to bottom
    this.speed.x = Math.random() * 2 + 0.5;
    if(Math.random() > 0.5){
        this.position.x = 0;
    } else {
        this.position.x = app.canv.width;
        this.speed.x *= -1;
    }
}

Sprite.prototype.draw = function(){
    if(this.state == Sprite.State.Idle) return;
    app.ctx.drawImage(this.img, this.position.x, this.position.y);
}

Sprite.prototype.update = function(dt){
    this.pastTime += dt;
    switch(this.state) {
        case Sprite.State.Move:
            this.updateMove();
            break;
        case Sprite.State.FlyAway:
            this.updateFlayAway();
            break;
        default:
            this.updateIdle();
    }
    this.draw();
}

Sprite.prototype.updateIdle = function(){
    if(this.pastTime < this.delay) return;
    this.state = Sprite.State.Move;
}

Sprite.prototype.updateMove = function(){
    this.position.x += this.speed.x;
    if (this.position.x < 0 || this.position.x > app.canv.width) {
       this.restart();
    }
}

Sprite.prototype.updateFlayAway = function(){

}

///////////// class Sprite end here //////////////////


function drawBackground() {
    app.ctx.fillStyle = app.CLEAR_COLOR_FILL;
    app.ctx.fillRect(0, 0, app.canv.width, app.canv.height);
}

var g_last_time = 0;

function update(time) {
    var deltaTime = time - g_last_time;
    g_last_time = time;
    drawBackground();
    var sp;
    for(var i = 0; i < app.spriteList.length; i++) {
        sp = app.spriteList[i];
        sp.update(deltaTime);
    }
}

function init() {
    /**
     *  Init canvas and add to app
     */
    app.canv = document.body.appendChild(document.createElement('canvas'));
    app.canv.setAttribute('id', 'app-canvas');
    app.canv.setAttribute('width', window.innerWidth);
    app.canv.setAttribute('height', window.innerHeight);
    app.canv.style.setProperty('position', 'absolute');
    app.canv.style.setProperty('top', '0');
    app.canv.style.setProperty('left', '0');
    app.canv.style.setProperty('right', '0');
    app.canv.style.setProperty('bottom', '0');
    app.canv.style.setProperty('width', '100%');
    app.canv.style.setProperty('height', '100%');
    app.ctx = app.canv.getContext('2d');

    app.FLOCK_SIZE = 10;
    app.FLOCK_MAX_DISTANCE_SQUARED = app.canv.width*app.canv.width / 9;

    /**
     *  Create sprites
     */
    app.spriteList = new Array(app.FLOCK_SIZE);
    for (var i = 0; i < app.spriteList.length; i++) {
        app.spriteList[i] = new Sprite('images/' + imageList[i % imageList.length])
    };
}

init();
(function loop(time) {
    update(time);
    window.requestAnimationFrame(loop);
})();