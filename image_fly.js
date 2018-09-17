
// Create app namespace
var app = app || {};
window.app = app;
app.CLEAR_COLOR_FILL = '#000000';

var g_spriteNum = 20;
var g_imageList = ["3.png", "5.png", "11.png", "6.png", "7.png", "8.png", "9.png", "10.png"];


///////////// class Sprite start here //////////////////

function Sprite(imageName){
    this.position = { x:0, y:0 };
    this.speed = { x:0, y:0 };
    this.pastTime = 0;
    this.state = Sprite.State.Loading;
    // load image
    this.img = new Image();
    var self = this;
    this.img.onload = function(){
        self.onImageLoaded();
    };
    this.img.src = imageName;
    // this.img = document.getElementById("img1");
    this.restart();
}

Sprite.State = { "Loading":0, "Idle": 1, "Move": 2, "FlyAway":3 }

Sprite.prototype.onImageLoaded = function() {
    this.restart();
}

Sprite.prototype.restart = function() {
    this.state = Sprite.State.Idle;
    this.opacity = 0.4;
    this.pastTime = 0;
    this.delay = Math.random() * 8000; // randomly delay appear
    this.position.y = (Math.random() + 0.03) * app.canv.height * 0.85; // keep image not too close to bottom
    this.speed.x = Math.random() * 2 + 0.5;
    if(Math.random() > 0.5){
        this.position.x = -this.img.width;
    } else {
        this.position.x = app.canv.width;
        this.speed.x *= -1;
    }
}

Sprite.prototype.draw = function(){
    if(this.state == Sprite.State.Idle) return;
    app.ctx.globalAlpha = this.opacity;
    app.ctx.drawImage(this.img, this.position.x, this.position.y);
    app.ctx.globalAlpha = 1;
}

Sprite.prototype.update = function(dt){
    if(this.state == Sprite.State.Loading) return;
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
    if (this.position.x < -this.img.width || this.position.x > app.canv.width) {
       this.restart();
    }
}

Sprite.prototype.updateFlayAway = function(){
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
    if (this.position.x < -this.img.width || this.position.x > app.canv.width
    || this.position.y < -this.img.height || this.position.y > app.canv.height) {
        this.restart();
    }
}

Sprite.prototype.isCollide = function(x, y) {
    if(this.state != Sprite.State.Move) return false;
    var tolerance = 50;
    if(x < this.position.x - tolerance) return false;
    if(x > this.position.x + this.img.width + tolerance) return false;
    if(y < this.position.y - tolerance) return false;
    if(y > this.position.y + this.img.height + tolerance) return false;
    return true;
}

Sprite.prototype.onMouseOver = function() {
    if(this.state != Sprite.State.Move) return false;
    this.opacity = 1;
}

Sprite.prototype.onMouseClick = function() {
    if(this.state != Sprite.State.Move) return false;
    var getRandomSpeed = function(){ // a local function
        var direct = Math.random() < 0.5 ? 1 : -1;
        var speed = Math.random() * 15 + 10;
        return speed * direct;
    }
    this.speed.x = getRandomSpeed();
    this.speed.y = getRandomSpeed();
    this.state = Sprite.State.FlyAway;
}

///////////// class Sprite end here //////////////////

function onMouseMove(ev){
    var sp;
    for(var i = 0; i < app.spriteList.length; i++) {
        sp = app.spriteList[i];
        if(sp.isCollide(ev.clientX, ev.clientY)){
            sp.onMouseOver();
            return;
        }
    }
}

function onMouseClick(ev){
    var sp;
    for(var i = 0; i < app.spriteList.length; i++) {
        sp = app.spriteList[i];
        if(sp.isCollide(ev.clientX, ev.clientY)){
            sp.onMouseClick();
            return;
        }
    }
}

function drawBackground() {
    app.ctx.fillStyle = app.CLEAR_COLOR_FILL;
    app.ctx.fillRect(0, 0, app.canv.width, app.canv.height);
}

var g_last_time = 0;

function update(time) {
    if(typeof(time) == "undefined") return;
    drawBackground();

    // calculate delta time
    var deltaTime = time - g_last_time;
    g_last_time = time;
    var sp;
    for(var i = 0; i < app.spriteList.length; i++) {
        sp = app.spriteList[i];
        sp.update(deltaTime);
    }
}

function init() {
    // app.canv = document.body.appendChild(document.createElement('canvas'));
    // app.canv.setAttribute('id', 'app-canvas');
    app.canv = document.getElementById("appCanvas");
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

    // create sprites
    app.spriteList = new Array(g_spriteNum);
    for (var i = 0; i < app.spriteList.length; i++) {
        app.spriteList[i] = new Sprite('images/' + g_imageList[i % g_imageList.length])
    };
    // register mouse event
    app.canv.addEventListener("mousemove", onMouseMove);
    app.canv.addEventListener("click", onMouseClick);
}

init();
(function loop(time) {
    update(time);
    window.requestAnimationFrame(loop);
})();