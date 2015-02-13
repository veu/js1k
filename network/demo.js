// config
var
    // size for area with nodes
    width = 600,
    height = 400,
    // top and left offset
    offset = 20,

    // number of columns
    columns = 24,
    // number of rows
    rows = 16,

    // simulation speed
    fps = 30,

    // minimum radius for hype circles
    minRadius = 10,
    // maximum radius for hype circles
    maxRadius = 50,
    // likelyhood to get hyped if touched by hype circle
    hypeRate = 0.2;


var nodes, hypeWaves;

function setup() {
    nodes = [],
    hypeWaves = [];
    for (var y = rows; y--;) {
        for (var x = columns; x--;) {
            nodes.push({
                x: (x / columns * width) + offset + (Math.random() - .5) * 12,
                y: (y / rows * height) + offset + (Math.random() - .5) * 12,
                r: (Math.random() * (maxRadius - minRadius) | 0) + minRadius,
                drawRadius: function () { return this.r / maxRadius * 6; },
                distance: function (p) { return Math.sqrt((x = this.x - p.x) * x + (y = this.y - p.y) * y, 2); },
                hype: function () { this.hyped = 1; hypeWaves.push({x: this.x, y: this.y, r: 0, rMax: this.r}); }
            });
        }
    }
    setInterval(update, 1000 / fps | 0);
}

function draw() {
    var i, node, wave;
    c.fillStyle = '#000';
    c.fillRect(0, 0, a.width, a.height);

    for (i in nodes) {
        node = nodes[i];
        c.beginPath();
        c.arc(node.x, node.y, node.drawRadius(), 0, 7, 0);
        c.fillStyle = node.hyped ? '#fff' : '#aaf';
        c.fill();
        c.strokeStyle = '#000';
        c.stroke(); 
    }

    for (i in hypeWaves) {
        wave = hypeWaves[i];
        c.beginPath();
        c.arc(wave.x, wave.y, wave.r, 0, 7, 0);
        c.strokeStyle = '#f00';
        c.stroke(); 
    }
}

function update() {
    var i, k, node, wave;
    for (i in hypeWaves) {
        wave = hypeWaves[i];
        wave.r++;
        for (k in nodes) {
            node = nodes[k];
            if (node.hyped || Math.abs(node.distance(wave) - wave.r) > 2) continue;
            if (Math.random() < hypeRate) {
                node.hype()
            }
        }
    }
    hypeWaves = hypeWaves.filter(function (h) { return h.r < h.rMax; });
    draw();
}

function reset() {
    for (var i in nodes) {
        nodes[i].hyped = 0;
    }
}

document.onclick = function (e) {
    var i, node, mouse = {x: e.pageX, y: e.pageY};
    for (i in nodes) {
        node = nodes[i];
        if (node.distance(mouse) <= node.drawRadius()) {
            node.hype();
            break;
        }

    }
};

setup();
