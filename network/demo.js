// config
var
    // top and left offset
    offset = 20,
    // how far nodes are apart
    spread = 25,

    // number of columns
    gridWidth = (a.width - offset * 2) / spread + 1 | 0,
    // number of rows
    gridHeight = (a.height - offset * 2) / spread + 1 | 0,

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

function getColor(col) {
    return "rgba(" + [255, (255 - col), col, 1] + ")";
}

function draw() {
    var i, node;
    c.fillStyle = '#000';
    c.fillRect(0, 0, a.width, a.height);

    for (i in nodes) {
        node = nodes[i];
        node.move();
        c.beginPath();
        c.arc(node.x, node.y, node.drawRadius(), 0, 7, 0);
        // c.fillStyle = node.hyped ? '#fff' : '#aaf';
        c.fillStyle = getColor(node.color);
        c.fill();
        // c.strokeStyle = '#000';
        // c.stroke();
    }

    for (i in hype) {
        c.beginPath();
        c.arc(hype[i].node.x, hype[i].node.y, hype[i].r, 0, 7, 0); // hype moves with node.
        // c.arc(hype[i].x, hype[i].y, hype[i].r, 0, 7, 0);
        c.strokeStyle = getColor(hype[i].node.color); //'#f00';
        c.stroke();
    }
}

function update() {
    var i, k, node;
    for (i in hype) {
        hype[i].r++;
        for (k in nodes) {
            node = nodes[k];
            if (node.hyped > 0 || Math.abs(node.distance(hype[i]) - hype[i].r) > 2) continue;
            if (Math.random() < hypeRate) {
                node.hype(hype[i]);
            }
        }
    }
    hype = hype.filter(function (h) {
        var alive = h.r < h.rMax;
        // if (!alive) h.node.hyped = 0;
        return alive;
    });
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
            node.hype(node);
            break;
        }

    }
};

(function setup() {
    for (var y = gridHeight; y--;) {
        for (var x = gridWidth; x--;) {
            nodes.push({
                color: Math.random() * 255 | 0,
                x: x * spread + offset + (Math.random() - .5) * 12,
                y: y * spread + offset + (Math.random() - .5) * 12,
                vx: 0, vy: 0,
                r: (Math.random() * (maxRadius - minRadius) | 0) + minRadius,
                move: function() { this.x += this.vx; this.y += this.vy; this.vx *= .9; this.vy *= .9; },
                drawRadius: function () { return this.r / maxRadius * 6; },
                distance: function (p) { return Math.sqrt((x = this.x - p.x) * x + (y = this.y - p.y) * y, 2); },
                hype: function (hyper) {
                    // a hyper hypes a hypee
                    if (hyper.node) this.color = (hyper.node.color + (Math.random() - .5) * 20) | 0; // adopt color with slight mutation
                    this.vx = -(this.x - hyper.x) * .05;
                    this.vy = -(this.y - hyper.y) * .05;
                    this.hyped = 1;
                    hype.push({node: this, x: this.x, y: this.y, r: 0, rMax: this.r}); // only need reference to node in hype array...?
                }
            });
        }
    }
    setInterval(update, 1000 / fps | 0);
})();
