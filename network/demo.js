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
    // hype cooldown in frames
    cooldown = 200,

    // simulation speed
    fps = 30,

    // minimum radius for hype circles
    minRadius = 10,
    // maximum radius for hype circles
    maxRadius = 50,

    nodes = [],
    hype = [],

getColor = function(col, op) {
    return "rgba(" + [255, (255 - col), col, op || 1] + ")";
},

draw = function() {
    var i, node;
    c.fillStyle = '#000';
    c.fillRect(0, 0, a.width, a.height);

    for (i in nodes) {
        node = nodes[i];
        node.move();
        c.beginPath();
        c.arc(node.x + (node.hyped && Math.random() / 2), node.y + (node.hyped && Math.random() / 2), node.drawRadius(), 0, 7, 0);
        c.fillStyle = getColor(node.color);
        c.fill();
    }

    for (i in hype) {
        c.beginPath();
        c.arc(hype[i].node.x, hype[i].node.y, hype[i].r, 0, 7, 0); // hype moves with node.
        c.fillStyle = getColor(hype[i].node.color, (1 - hype[i].r / hype[i].rMax) * .5); //'#f00';
        c.fill();
        c.strokeStyle = getColor(hype[i].node.color); //'#f00';
        c.stroke();
    }
},

update = function() {
    var i, k, node;
    for (k in nodes) {
        node = nodes[k];
        if (node.hyped) node.hyped--;
    }
    for (i in hype) {
        hype[i].r++;
        for (k in nodes) {
            node = nodes[k];
            if (node.hyped > 0 || Math.abs(node.distance(hype[i]) - hype[i].r) > 2) continue;
            node.tryHype(hype[i]);
        }
    }
    hype = hype.filter(function (h) {
        var alive = h.r < h.rMax;
        return alive;
    });
    draw();
},

reset = function() {
    for (var i in nodes) {
        nodes[i].hyped = 0;
    }
};

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

for (var y = gridHeight; y--;) {
    for (var x = gridWidth; x--;) {
        nodes.push({
            color: Math.random() * 256 | 0,
            x: x * spread + offset + (Math.random() - .5) * 12,
            y: y * spread + offset + (Math.random() - .5) * 12,
            vx: 0, vy: 0,
            r: (Math.random() * (maxRadius - minRadius) | 0) + minRadius,
            move: function() { this.x += this.vx; this.y += this.vy; this.vx *= .9; this.vy *= .9; },
            drawRadius: function () { return this.r / maxRadius * 6; },
            distance: function (p) { return Math.sqrt((x = this.x - p.x) * x + (y = this.y - p.y) * y, 2); },
            hyped: 0,
            tryHype: function (hyper) {
                var colorDiff = Math.abs(this.color - hyper.node.color);
                if (Math.random() < (1 - colorDiff / 256) / 4) {
                    this.hype(hyper);
                }
            },
            hype: function (hyper) {
                // a hyper hypes a hypee
                if (hyper.node) {
                    this.color = (hyper.node.color + (Math.random() - .5) * 20) | 0;
                    this.color = Math.max(0, Math.min(255, this.color));
                } // adopt color with slight mutation
                this.vx = -(this.x - hyper.x) * .05;
                this.vy = -(this.y - hyper.y) * .05;
                this.hyped = cooldown;
                hype.push({node: this, x: this.x, y: this.y, r: 0, rMax: this.r}); // only need reference to node in hype array...?
            }
        });
    }
}
setInterval(update, 1000 / fps | 0);
