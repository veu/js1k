// size of used area
width = 804,
height = 640,

// top and left offset
offset = 40,
// how far nodes are apart
spread = 25,

// number of columns
gridWidth = 30,
// number of rows
gridHeight = 20,
// hype cooldown in frames
cooldown = 200,

// simulation speed
fps = 30,

// minimum radius for hype circles
minRadius = 10,
// maximum radius for hype circles
maxRadius = 60,
// ticks since last hype
idle = 150,

nodes = [],

spectrum = {},

getColor = function(col, op) {
    return 'rgba(' + [255, (255 - col), col, op || 1] + ')';
},

onclick = function (e) {
    var i, node, mouse = {x: e.pageX / scale - cOffset, y: e.pageY / scale};
    for (i in nodes) {
        node = nodes[i];
        if (node.distance(mouse) <= node.drawRadius()) {
            node.hype(node);
            break;
        }

    }
}

for (var y = gridHeight; y--;) {
    for (var x = gridWidth; x--;) {
        nodes.push({
            color: Math.random() * 256 | 0,
            x: x * spread + offset + (Math.random() - .5) * 12,
            y: y * spread + offset + (Math.random() - .5) * 12,
            vx: 0, vy: 0,
            move: function() { this.x += this.vx; this.y += this.vy; this.vx *= .9; this.vy *= .9; },
            drawRadius: function () { return this.hypeRMax / maxRadius * 6; },
            distance: function (p) { return Math.sqrt((x = this.x - p.x) * x + (y = this.y - p.y) * y, 2); },
            hyped: 0,
            hypeR: 0,
            hypeRMax: (Math.random() * (maxRadius - minRadius) | 0) + minRadius,
            tryHype: function (hyper) {
                var colorDiff = Math.abs(this.color - hyper.color);
                if (Math.random() < (1 - colorDiff / 256) / 3) {
                    this.hype(hyper);
                }
            },
            hype: function (hyper) {
                idle = 0;
                spectrum[this.color]--;
                // a hyper hypes a hypee
                if (hyper) {
                    this.color = (hyper.color + (Math.random() - .5) * 20) | 0;
                    this.color = Math.max(0, Math.min(255, this.color));
                } // adopt color with slight mutation
                spectrum[this.color]++;
                this.vx = -(this.x - hyper.x) * .04;
                this.vy = -(this.y - hyper.y) * .04;
                this.hyped = cooldown;
                this.hypeR = 1
            }
        })
    }
}

for (var i = 0; i < 256; i++) {
    spectrum[i] = 0;
}
for (var i in nodes) {
    spectrum[nodes[i].color]++;
}

setInterval(function() {
    var i, k, node, node2, alive;

    if (++idle == 200) {
       node = nodes[Math.random() * 256 | 0];
       node.hype(node);
    }

    /// update {
    for (i in nodes) {
        node = nodes[i];
        if (node.hyped) node.hyped--;

        if (!node.hypeR) continue;

        node.hypeR++;
        for (k in nodes) {
            node2 = nodes[k];
            if (node2.hyped > 0 || Math.abs(node2.distance(node) - node.hypeR) > 2) continue;
            node2.tryHype(node)
        }

        alive = node.hypeR < node.hypeRMax;
        if (!alive) node.hypeR = 0
    }
    /// }

    /// draw {
    a.width = a.width;

    c.fillStyle = '#000';
    c.fillRect(0, 0, a.width, a.height);

    c.scale(scale = Math.min(a.width / width, a.height / height), scale);
    c.translate(cOffset = (a.width / scale - width) / 2, 0);
    for (i in nodes) {
        node = nodes[i];
        node.move();
        c.beginPath();
        c.arc(node.x + (node.hyped && Math.random() / 2), node.y + (node.hyped && Math.random() / 2), node.drawRadius(), 0, 7, 0);
        c.fillStyle = getColor(node.color);
        c.fill();

        if (!node.hypeR) continue;

        c.beginPath();
        c.arc(node.x, node.y, node.hypeR, 0, 7, 0); // hype moves with node.
        c.fillStyle = getColor(node.color, (1 - node.hypeR / node.hypeRMax) * .5); //'#f00';
        c.fill();
        c.strokeStyle = getColor(node.color); //'#f00';
        c.stroke();
    }

    for (var i in spectrum) {
        c.fillStyle = getColor(i);
        c.fillRect(147 + i * 2, 560 - spectrum[i] * 2, 2, spectrum[i] * 2);
    }

    c.font = '30px Trebuchet MS';
    c.fillStyle = '#fff';
    c.fillRect(137,560,530,1);
    c.fillStyle = '#fff';
    c.fillText('Evolution of Hype', 283, 610);
    /// }
}, 1000 / fps | 0);
