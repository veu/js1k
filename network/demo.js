// size of used area
width = 804,
height = 640,

// top and left offset
offset = 40,
// how far nodes are apart
spread = 25,

// hype cooldown in frames
cooldown = 200,

// ticks since last hype
idle = 150,

nodes = [],

spectrum = [],

getColor = function(color, op) {
    return 'rgba(' + [255, 255 - color, color, op || 1] + ')';
},

onclick = function (e) {
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
            color: Math.random() * 256 | 0,
            x: x * spread + offset + Math.random() * 12 - 6,
            y: y * spread + offset + Math.random() * 12 - 6,
            vx: 0, vy: 0,
            move: function() { this.x += this.vx; this.y += this.vy; this.vx *= .9; this.vy *= .9; },
            distance: function (p) { return Math.sqrt((x = this.x - p.x) * x + (y = this.y - p.y) * y, 2) },
            hyped: 0,
            hypeR: 0,
            hypeRMax: Math.random() * 5 + 1 | 0,
            hype: function (hyper) {
                idle = 0;
                spectrum[this.color]--;
                // adopt color with slight mutation
                this.color = hyper.color + Math.random() * 20 - 10 | 0;
                this.color = Math.max(0, Math.min(255, this.color));
                spectrum[this.color]++;
                this.vx = (hyper.x - this.x) / 25;
                this.vy = (hyper.y - this.y) / 25;
                this.hyped = cooldown;
                this.hypeR = 1
            }
        })

for (i = 256; i--;)
    spectrum[i] = 0;
nodes.some(function (node) {
    spectrum[node.color]++
});

setInterval(function(i, k, node, node2) {
    /// update {
        if (++idle == 200) {
           node = nodes[Math.random() * 256 | 0];
           node.hype(node);
        }
    
        nodes.some(function (node) {
            if (node.hyped) node.hyped--;
    
            if (node.hypeR) {
                node.hypeR++;
                nodes.some(function (node2) {
                    node2.hyped <= 0 &&
                        Math.abs(node2.distance(node) - node.hypeR) < 2 &&
                        Math.random() * 3 < 1 - Math.abs(node2.color - node.color) / 256 &&
                        node2.hype(node)
                });
       
                // stop hype if it reached its maximum size
                node.hypeR < node.hypeRMax * 10 || (node.hypeR = 0)
            }
        })
    /// }

    /// draw {
        a.width = a.width;
        c.fillRect(0, 0, a.width, a.height);
        c.scale(scale = Math.min(a.width / width, a.height / height), scale);
        c.translate(cOffset = (a.width / scale - width) / 2, 0);

        nodes.some(function (node) {
            node.move();
            c.beginPath();
            c.arc(node.x + (node.hyped && Math.random() / 2), node.y + (node.hyped && Math.random() / 2), node.hypeRMax, 0, 7, 0);
            c.fillStyle = getColor(node.color);
            c.fill();
    
            if (node.hypeR) {
                c.beginPath();
                c.arc(node.x, node.y, node.hypeR, 0, 7, 0); 
                c.fillStyle = getColor(node.color, .15);
                c.fill();
                c.strokeStyle = getColor(node.color);
                c.stroke()
            }
        });
    
        for (i = 256; i--;)
            c.fillStyle = getColor(i),
            c.fillRect(147 + i * 2, 610 - spectrum[i] * 2, 2, spectrum[i] * 2);
    
        c.font = '30px Trebuchet MS';
        c.fillStyle = '#fff';
        c.fillRect(137,610,530,1);
        c.fillText('Evolution of Hype', 283, 570)
    /// }
}, 33)
