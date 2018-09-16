// Create app namespace
var app = app || {};
window.app = app;
app.CLEAR_COLOR_FILL = '#292522';

imageList = ["picture1.png", "picture1.png"]

/**
 *  SpriteRec class
 */
function SpriteRec(options) {
    options = options || {};

    this.position = options.position || { x:0, y:0 };
    this.speed = options.speed || { x:0, y:0 };

    this.rotation = options.rotation || 0;
    this.face = options.face || '';
    this.img = options.img;
}

function NewSprite(face, xPos, yPos, xVel, yVel) {
    var sp = new SpriteRec({
        position: {
            x: xPos,
            y: yPos
        },
        speed: {
            x: xVel,
            y: yVel
        },
        face: face,
        rotation: 0,
        img: null
    });
    spriteInit(sp)
    return sp;
}

/**
 *  Original lab-like functions
 */
function handleSprite(sp) {
    // Move by speed, bounce off screen edges.
    sp.position.x += sp.speed.x;
    sp.position.y += sp.speed.y;
    if (sp.position.x < 0)
    {
        sp.speed.x = Math.abs(sp.speed.x);
        sp.position.x = 0;
    }
    if (sp.position.y < 0)
    {
        sp.speed.y = Math.abs(sp.speed.y);
        sp.position.y = 0;
    }
    if (sp.position.x > app.canv.width)
    {
        sp.speed.x = -Math.abs(sp.speed.x);
        sp.position.x = app.canv.width;
    }
    if (sp.position.y > app.canv.height)
    {
        sp.speed.y = -Math.abs(sp.speed.y);
        sp.position.y = app.canv.height;
    }

    sp.rotation = Math.atan2(sp.speed.y, sp.speed.x);
}

function drawSprite(sp) {
    // app.ctx.fillStyle = 'transparent';
    // app.ctx.strokeStyle = '#D6A692';
    // app.ctx.beginPath();
    // app.ctx.arc(sp.position.x, sp.position.y, 5, sp.rotation, sp.rotation + 2*Math.PI);
    // app.ctx.lineTo(sp.position.x, sp.position.y);
    // app.ctx.closePath();
    // app.ctx.stroke();

    app.ctx.drawImage(sp.img, sp.position.x, sp.position.y);
}



function spriteInit(sp){
    var idx = Math.floor(Math.random() * imageList.length)
    sp.img = new Image();
    sp.img.src='images/' + imageList[idx];
    // sp.position.y = Math.random() * app.canv.height
    // sp.position.x = Math.random() > 0.5 ? 0 : app.canv.width
    // sp.position.speed.x = Math.random() * 1 - 0.5
}

function drawBackground() {
    app.ctx.fillStyle = app.CLEAR_COLOR_FILL;
    app.ctx.fillRect(0, 0, app.canv.width, app.canv.height);
}

function spriteBehavior() {
    // calculate stuff
    for(var i = 0; i < app.spriteList.length; i++) {
        var count = 0;
        var currentSprite = app.spriteList[i];
        app.averagePosition[i] = { x: 0, y: 0 };

        for(var j = 0; j < app.spriteList.length; j++) {
            var dist = {
                x: app.spriteList[j].position.x - currentSprite.position.x,
                y: app.spriteList[j].position.y - currentSprite.position.y
            };

            var distSquared = dist.x * dist.x + dist.y * dist.y;

            if(distSquared < app.FLOCK_MAX_DISTANCE_SQUARED) {
                app.averagePosition[i].x += dist.x;
                app.averagePosition[i].y += dist.y;
                count++;
            }
        }

        if(count > 0) {
            app.averagePosition[i].x /= count;
            app.averagePosition[i].y /= count;
        }
    }

    var cohesionWeight = 0.0001;
    // apply the stuff calculated above
    for(var i = 0; i < app.spriteList.length; i++) {
        app.spriteList[i].speed.x += app.averagePosition[i].x * cohesionWeight;
        app.spriteList[i].speed.y += app.averagePosition[i].y * cohesionWeight;

        app.spriteList[i].position.x += app.spriteList[i].speed.x;
        app.spriteList[i].position.y += app.spriteList[i].speed.y;
    }
}


/**
 *  Loop-based app structure
 */

function draw() {
    drawBackground();

    spriteBehavior(); // Din kod!

    /**
     *  Loop though all sprites. (Several loops in real engine.)
     */
    var sp;
    for(var i = 0; i < app.spriteList.length; i++) {
        sp = app.spriteList[i];
        handleSprite(sp);
        drawSprite(sp);
    }
}

function update() {

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

    /**
     *  Load texture data
     */
        // TextureData *sheepFace, *blackFace, *dogFace, *foodFace;
        // LoadTGATextureSimple("bilder/leaves.tga", &backgroundTexID); // Bakgrund
        // sheepFace = GetFace("bilder/sheep.tga"); // Ett får
    var sheepFace = 'a';
    // blackFace = GetFace("bilder/blackie.tga"); // Ett svart får
    // dogFace = GetFace("bilder/dog.tga"); // En hund
    // foodFace = GetFace("bilder/mat.tga"); // Mat

    app.FLOCK_SIZE = 50;
    app.FLOCK_MAX_DISTANCE_SQUARED = app.canv.width*app.canv.width / 9;
    app.averagePosition = new Array(app.FLOCK_SIZE);

    /**
     *  Create sprites
     */
    app.spriteList = new Array(app.FLOCK_SIZE);
    for (var i = 0; i < app.spriteList.length; i++) {
        app.spriteList[i] = NewSprite(
            sheepFace,  // graphics
            Math.random() * app.canv.width,  // x position
            Math.random() * app.canv.height,  // y position
            Math.random() * 1 - .5,  // x speed
            Math.random() * 1 - .5);  // y speed
    };
}

init();
(function loop(time) {
    update(time);
    draw(time);
    window.requestAnimationFrame(loop);
})();