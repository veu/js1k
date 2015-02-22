// ticks since last hype
idle = showInstructions = 150,

nodes = [],
spectrum = [],

setColor = function (e, f) {
    c.fillStyle = c.strokeStyle = 'rgba(' + [255, 255 - e, e, f] + ')';
},

onclick = function (e, f) {
    showInstructions = nodes.some(function (node) {
        (x = e.pageX / cScale - offset - node.x) * x + (y = e.pageY / cScale - node.y) * y > node.hypeRMax * node.hypeRMax
            || startHype(node, node)
    })
},

startHype = function (e, f) {
    spectrum[f.color]--;
    // adopt color with slight mutation
    f.color = -min(idle = 0, -min(e.color + 20 * random() - 10 | 0, 255)),
    spectrum[f.color]++;
    f.vx = (e.x - f.x) / 25;
    f.vy = (e.y - f.y) / 25;
    f.hyped = 200;
    f.hypeR = 1
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

setInterval(function (e, f) {
    if (++idle == 200)
        startHype(node = nodes[256 * random() | 0], node);

    c.fillRect(0, 0, a.width = a.width, a.height),
    c.scale(cScale = min(a.width / 804, a.height / 640), cScale),
    c.translate(offset = (a.width / cScale - 804) / 2, 0);

    for (e = 256; e--;)
        setColor(e, 1),
        c.fillRect(147 + e * 2, 610 - spectrum[e] * 2, 1, spectrum[e] * 2);

    c.fillStyle = '#fff';
    if (showInstructions)
        c.fillText('Click a circle to start a hype', 331, 590);
    c.font = '30px Trebuchet MS',
    c.fillText('Evolution of Hype', 283, 570)
    c.fillRect(137, 610, 530, 1),

    nodes.some(function (node) {
        if (node.hyped) node.hyped--;

        node.x += node.vx *= .9;
        node.y += node.vy *= .9;

        if (!node.hyped)
            node.x += (node.o.x - node.x) / 500,
            node.y += (node.o.y - node.y) / 500;

        if (node.hypeR) {
            node.hypeR++;
            nodes.some(function (e, f) {
                e.hyped ||
                    abs(sqrt((x = e.x - node.x) * x + (y = e.y - node.y) * y, 2) - node.hypeR) < 2 &&
                    3 * random() < 1 - abs(e.color - node.color) / 256 &&
                    startHype(node, e)
            });

            if (node.hypeR > node.hypeRMax * 10)
                node.hypeR = 0

            c.beginPath(),
            c.arc(node.x, node.y, node.hypeR, 0, 7, 0),
            setColor(node.color, .15),
            c.fill(),
            setColor(node.color, .3),
            c.stroke()
        }
    });

    nodes.some(function (node) {
        c.beginPath(),
        c.arc(node.x + node.hyped * random() / 100, node.y + node.hyped * random() / 100, node.hypeRMax, 0, 7, 0),
        setColor(node.color, 1),
        c.shadowColor = c.fillStyle;
        c.shadowBlur = node.hypeRMax * 3;
        c.fill()
    })
}, 33)
