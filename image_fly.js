
// Create app namespace
var app = app || {};
window.app = app;
app.CLEAR_COLOR_FILL = '#000000';

imageList = ["3.png", "5.png", "11.png", "6.png", "7.png", "8.png", "9.png", "10.png"]

function Sprite(){
    this.position = { x:0, y:0 };
    this.speed = { x:0, y:0 };

    this.img = new Image();
    var idx = Math.floor(Math.random() * imageList.length)
    this.img.src = 'images/' + imageList[idx];
    this.position.y = Math.random() * app.canv.height
    this.position.x = Math.random() > 0.5 ? 0 : app.canv.width
    this.speed.x = Math.random() * 2 + 0.5
}



Sprite.prototype.draw = function(dt){
    app.ctx.drawImage(this.img, this.position.x, this.position.y);
}

/**
 *  Original lab-like functions
 */
function handleSprite(sp) {
    // Move by speed, bounce off screen edges.
    sp.position.x += sp.speed.x;
    // sp.position.y += sp.speed.y;
   if (sp.position.x < -400)
    {
        sp.speed.x = Math.abs(sp.speed.x);
        sp.position.x = -400;
    }

    if (sp.position.x > app.canv.width)
    {
        sp.speed.x = -Math.abs(sp.speed.x);
        sp.position.x = app.canv.width;
    }
}


function drawSprite(dt, sp) {
    app.ctx.drawImage(sp.img, sp.position.x, sp.position.y);
}



function spriteInit(sp){
    var idx = Math.floor(Math.random() * imageList.length)
    sp.img = new Image();
    sp.img.src = 'images/' + imageList[idx];
    sp.position.y = Math.random() * app.canv.height
    sp.position.x = Math.random() > 0.5 ? 0 : app.canv.width
    sp.speed.x = Math.random() * 2 + 0.5
}

function drawBackground() {
    app.ctx.fillStyle = app.CLEAR_COLOR_FILL;
    app.ctx.fillRect(0, 0, app.canv.width, app.canv.height);
}


function update(dt) {
    drawBackground();
    var sp;
    for(var i = 0; i < app.spriteList.length; i++) {
        sp = app.spriteList[i];
        handleSprite(sp);
        sp.draw(dt);
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
        app.spriteList[i] = new Sprite()
    };
}

init();
(function loop(time) {
    update(time);
    window.requestAnimationFrame(loop);
})();