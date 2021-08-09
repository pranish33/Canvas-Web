let c, ctx, W, H;
let dots = [];
let mouse, touch;
let move = false;

const random = (max = 1, min = 0) => Math.random() * (max - min) + min;

class Dot {
    constructor(x, y, a) {
        this.x = this.xSt = x
        this.y = this.ySt = y
        this.a = a
    }
}

const updateDots = () => {
    for (let i = 0; i < dots.length; i++) {
        let dx = mouse.x - dots[i].x
        let dy = mouse.y - dots[i].y
        if (move && Math.hypot(dx, dy) < 30) {
            let a = Math.atan2(dy, dx);
            dots[i].x -= Math.cos(a) * 10;
            dots[i].y -= Math.sin(a) * 10;
        }
        else {
            dots[i].x = repos(dots[i].x, dots[i].xSt, 0.01);
            dots[i].y = repos(dots[i].y, dots[i].ySt, 0.01);
            dots[i].x = dots[i].x + 1 * Math.cos(dots[i].a)
            dots[i].y = dots[i].y + 1 * Math.sin(dots[i].a)
        }
        dots[i].a += 0.05
        for (let j = i; j < dots.length; j++) {
            let d = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y)
            if (d < 70 && i !== j) {
                ctx.strokeStyle = 'rgba(0,255,255,' + 15 / d + ')'
                ctx.beginPath()
                ctx.lineWidth = 0.8
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();
            }


        }
    }
}

const repos = (a, b, c) => a + (b - a) * c;

const eventsListener = () => {
    mouse = {
        x: null,
        y: null
    };
    touch = {
        x: null,
        y: null
    };
    c.addEventListener("mousemove", function (event) {
        if (move) {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        }
        else {
            mouse.x = null;
            mouse.y = null;
        }
    });
    c.addEventListener("mousedown", function (event) {
        move = true;
        mouse.x = event.clientX;
        mouse.y = event.clientY;

    });
    c.addEventListener("mouseup", function () {
        move = false;
        mouse.x = null;
        mouse.y = null;
    });
    c.addEventListener("touchstart", function (event) {
        let touch = event.changedTouches[0];
        let touchX = parseInt(touch.clientX);
        let touchY = parseInt(touch.clientY);
        mouse.x = touchX - c.offsetLeft;
        mouse.y = touchY - c.offsetTop;
        move = true;
    });
    c.addEventListener("touchmove", function (event) {
        event.preventDefault();
        if (move) {
            let touch = event.changedTouches[0];
            let touchX = parseInt(touch.clientX);
            let touchY = parseInt(touch.clientY);
            mouse.x = touchX - c.offsetLeft;
            mouse.y = touchY - c.offsetTop;
        }
    });
    c.addEventListener("touchend", function () {
        mouse.x = null;
        mouse.y = null;
        move = false;
    });
};

const createDots = () => {
    let a = 0
    for (let x = -50; x < W + 50; x += 30) {
        for (let y = -50; y < H + 50; y += 30) {
            a = x / 100 + Math.sin(y / 50)
            dots.push(new Dot(x, y, a))
        }
    }
};

const init = () => {
    c = document.getElementById("cnv");
    slImg = document.getElementById("sl_img");
    c.width = W = window.innerWidth;
    c.height = H = window.innerHeight;
    ctx = c.getContext("2d");
    createDots()
    eventsListener();
    requestAnimationFrame(animate);
};

const animate = () => {
    ctx.clearRect(0, 0, W, H);
    updateDots();
    requestAnimationFrame(animate);
};

onload = init;