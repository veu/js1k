// config
var
    // size for area with nodes
    width = 600,
    height = 400,
    // top and left offset
    offset = 20,

    // number of columns
    gridWidth = 24,
    // number of rows
    gridHeight = 16,

    // simulation speed
    fps = 30,

    // minimum radius for hype circles
    minRadius = 10,
    // maximum radius for hype circles
    maxRadius = 50,
    // likelyhood to get hyped if touched by hype circle
    hypeRate = 0.2;


var nodes = [],
    hype = [];

function draw() {
    var i, node;
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

    for (i in hype) {
        c.beginPath();
        c.arc(hype[i].x, hype[i].y, hype[i].r, 0, 7, 0);
        c.strokeStyle = '#f00';
        c.stroke(); 
    }
}

function update() {
    var i, k, node;
    for (i in hype) {
        hype[i].r++;
        for (k in nodes) {
            node = nodes[k];
            if (node.hyped || Math.abs(node.distance(hype[i]) - hype[i].r) > 2) continue;
            if (Math.random() < hypeRate) {
                node.hype()
            }
        }
    }
    hype = hype.filter(function (h) { return h.r < h.rMax; });
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

(function setup() {
    for (var y = gridHeight; y--;) {
        for (var x = gridWidth; x--;) {
            nodes.push({
                x: (x / gridWidth * width) + offset + (Math.random() - .5) * 12,
                y: (y / gridHeight * height) + offset + (Math.random() - .5) * 12,
                r: (Math.random() * (maxRadius - minRadius) | 0) + minRadius,
                drawRadius: function () { return this.r / maxRadius * 6; },
                distance: function (p) { return Math.sqrt((x = this.x - p.x) * x + (y = this.y - p.y) * y, 2); },
                hype: function () { this.hyped = 1; hype.push({x: this.x, y: this.y, r: 0, rMax: this.r}); }
            });
        }
    }
    setInterval(update, 1000 / fps | 0);
})();
