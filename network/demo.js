// size of used area
cWidth = 804,
cHeight = 640,
// ticks since last hype
idle = 150,

nodes = [],
spectrum = [],

addColor = function (e, f, g, h) {
    g.addColorStop(f, 'rgba(' + [255, 255 - e, e, h] + ')')
},

onclick = function (e, f, g, h) {
    nodes.some(function (node) {
        return distance(node, {x: e.pageX / cScale - offset, y: e.pageY / cScale}) <= node.hypeRMax
            && hype(node, node) | 1
    })
},

distance = function (e, f, g, h) {
    return sqrt((x = e.x - f.x) * x + (y = e.y - f.y) * y, 2)
},

hype = function (e, f, g, h) {
    spectrum[f.color]--;
    // adopt color with slight mutation
    f.color = -min(idle = 0, -min(e.color + 20 * random() - 10 | 0, 255)),
    spectrum[f.color]++;
    f.vx = (e.x - f.x) / 25;
    f.vy = (e.y - f.y) / 25;
    // set how long the node will be hyped
    f.hyped = 200;
    f.hypeR = f.hypeRMax
}

/// setup grid
for (y = 20; y--;)
    for (x = 30; x--;)
        nodes.push({
            color: 256 * random() | 0,
            x: x * 25 + 30 + 20 * random(),
            y: y * 25 + 30 + 20 * random(),
            vx: 0, vy: 0,
            hyped: 0,
            hypeR: 0,
            hypeRMax: 5 * random() + 1 | 0
        });

for (e = 256; e--;)
    spectrum[e] = 0;

nodes.some(function (node) {
    node.o = {x: node.x, y: node.y};
    spectrum[node.color]++
}),

setInterval(function (e, f, g, h) {
    if (++idle == 200)
        hype(node = nodes[256 * random() | 0], node);

    c.fillRect(0, 0, a.width = a.width, a.height),
    c.scale(cScale = min(a.width / cWidth, a.height / cHeight), cScale),
    c.translate(offset = (a.width / cScale - cWidth) / 2, 0),

    nodes.some(function (node) {
        if (node.hyped) node.hyped--;

        node.x += node.vx *= .9;
        node.y += node.vy *= .9;

        if (!node.hyped)
            node.x += (node.o.x - node.x) / 500,
            node.y += (node.o.y - node.y) / 500;

        // stop hype if it reached its maximum size
        if (node.hypeR > node.hypeRMax * 10)
            node.hypeR = 0

        g = c.createRadialGradient(x = node.x + node.hyped * random() / 100, y = node.y + node.hyped * random() / 100, 0, x, y, 60),
        addColor(node.color, node.hypeRMax / 80, g, 1),
        addColor(node.color, node.hypeRMax / 60, g, .2);
        if (node.hypeR)
            node.hypeR++,
            nodes.some(function (e, f, g, h) {
                e.hyped ||
                    abs(distance(node, e) - node.hypeR) < 2 &&
                    3 * random() < 1 - abs(e.color - node.color) / 256 &&
                    hype(node, e)
            }),
            addColor(node.color, node.hypeR / 70, g, .15),
            addColor(node.color, node.hypeR / 60, g, .2),
            addColor(node.color, node.hypeR / 55, g, 0);
        else
            addColor(node.color, node.hypeRMax / 20, g, 0);
        c.fillStyle = g;
        c.fillRect(node.x - 60, node.y - 60, 120, 120)
    });

    for (e = 256; e--;)
        c.fillStyle = 'rgba(' + [255, 255 - e, e, 1] + ')',
        c.fillRect(147 + e * 2, 610 - spectrum[e] * 2, 2, spectrum[e] * 2);

    c.font = '30px Trebuchet MS';
    c.fillStyle = '#fff';
    c.fillRect(137, 610, 530, 1),
    c.fillText('Evolution of Hype', 283, 570)
}, 33)
