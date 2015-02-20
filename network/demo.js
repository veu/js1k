// size of used area
cWidth = 804,
cHeight = 640,
// top and left offset
offset = 40,
// ticks since last hype
idle = 150,

nodes = [],

spectrum = [],

getColor = function(e, f) {
    return 'rgba(' + [255, 255 - e, e, f || 1] + ')';
},

onclick = function (e, f) {
    nodes.some(function (node) {
        if (node.distance({x: e.pageX / scale - cOffset, y: e.pageY / scale}) <= node.hypeRMax) {
            node.hype(node);
            return 1
        }
    })
}

/// setup grid
for (y = 20; y--;)
    for (x = 30; x--;)
        nodes.push({
            color: random() * 256 | 0,
            x: x * 25 + offset + random() * 12 - 6,
            y: y * 25 + offset + random() * 12 - 6,
            vx: 0, vy: 0,
            move: function(e, f) { this.x += this.vx; this.y += this.vy; this.vx *= .9; this.vy *= .9; },
            distance: function (e, f) { return sqrt((x = this.x - e.x) * x + (y = this.y - e.y) * y, 2) },
            hyped: 0,
            hypeR: 0,
            hypeRMax: random() * 5 + 1 | 0,
            hype: function (node) {
                idle = 0;
                spectrum[this.color]--;
                // adopt color with slight mutation
                this.color = node.color + random() * 20 - 10 | 0;
                this.color = -min(0, -min(255, this.color));
                spectrum[this.color]++;
                this.vx = (node.x - this.x) / 25;
                this.vy = (node.y - this.y) / 25;
                // set how long the node will be hyped
                this.hyped = 200;
                this.hypeR = 1
            }
        })

for (e = 256; e--;)
    spectrum[e] = 0;
nodes.some(function (node) {
    spectrum[node.color]++
});

setInterval(function(e, f) {
    /// update {
        if (++idle == 200) {
           node = nodes[random() * 256 | 0];
           node.hype(node);
        }
    
        nodes.some(function (node) {
            if (node.hyped) node.hyped--;
    
            if (node.hypeR) {
                node.hypeR++;
                nodes.some(function (e, f) {
                    e.hyped <= 0 &&
                        abs(node.distance(e) - node.hypeR) < 2 &&
                        random() * 3 < 1 - abs(e.color - node.color) / 256 &&
                        e.hype(node)
                });
       
                // stop hype if it reached its maximum size
                node.hypeR < node.hypeRMax * 10 || (node.hypeR = 0)
            }
        })
    /// }

    /// draw {
        a.width = a.width;
        c.fillRect(0, 0, a.width, a.height);
        c.scale(scale = min(a.width / cWidth, a.height / cHeight), scale);
        c.translate(cOffset = (a.width / scale - cWidth) / 2, 0);

        nodes.some(function (node) {
            node.move();
            for (e = 2; e--;)
                c.beginPath(),
                c.arc(node.x + random() * node.hyped * .01, node.y + random() * node.hyped * .01, node.hypeRMax * (e * 2 + 1), 0, 7, 0),
                c.fillStyle = getColor(node.color, e * .1),
                c.fill();
    
            if (node.hypeR) {
                c.beginPath();
                c.arc(node.x, node.y, node.hypeR, 0, 7, 0); 
                c.fillStyle = getColor(node.color, .15);
                c.fill();
                c.strokeStyle = getColor(node.color, .3);
                c.stroke()
            }
        });
    
        for (e = 256; e--;)
            c.fillStyle = getColor(e),
            c.fillRect(147 + e * 2, 610 - spectrum[e] * 2, 2, spectrum[e] * 2);
    
        c.font = '30px Trebuchet MS';
        c.fillStyle = '#fff';
        c.fillRect(137,610,530,1);
        c.fillText('Evolution of Hype', 283, 570)
    /// }
}, 33)
