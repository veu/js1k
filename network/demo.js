// whether instructions are visible
showInstructions =
// ticks since last hype started
idle = 150,

// node information (position, color, hype, ...)
nodes = [],

onclick = function (e, f) {
    // hide instructions
    showInstructions =
        // check if we clicked on a node
        nodes.some(function (node) {
            (x = e.pageX / cScale - offset - node.x) * x + (y = e.pageY / cScale - node.y) * y > node.radius * node.radius
                || startHype(node, node)
        })
},

startHype = function (e, f) {
    // adopt color with slight mutation towards hyper
    f.color = e.color + (f.color - e.color) / 10 * random() | 0,
    // move hypee closer to hyper
    f.vx = (e.x - f.x) / 25;
    f.vy = (e.y - f.y) / 25;
    // set hype length
    f.hyped = 200,
    // reset idle cooldown
    idle =
    // start hype wave 
    f.wave = 1
}

// setup grid
for (y = 20; y--;)
    for (x = 30; x--;)
        nodes.push({
            // node color
            color: 256 * random() | 0,
            // position
            x: x * 25 + 30 + 20 * random(),
            y: y * 25 + 30 + 20 * random(),
            // speed
            vx: 0, vy: 0,
            // hype (shaking animation)
            hyped: 0,
            // hype wave radius
            wave: 0,
            // node radius
            radius: 5 * random() + 1 | 0
        });

// remember original node positions
nodes.some(function (node) {
    node.node = {x: node.x, y: node.y}
}),

setInterval(function (e, f) {
    // start new hype after a cooldown
    ++idle - 200 ||
        startHype(node = nodes[256 * random() | 0], node);

    // reset context state and draw background
    c.fillRect(0, 0, a.width = a.width, a.height),
    // scale canvas to demo size
    c.scale(cScale = min(a.width / 804, a.height / 640), cScale),
    // center demo
    c.translate(offset = (a.width / cScale - 804) / 2, 0);

    // draw instruction
    c.fillStyle = '#fff',
    showInstructions &&
        c.fillText('Click a circle to hype it', 345, 590);

    // reset color spectrum
    spectrum = [],

    // draw title
    c.font = '30px Trebuchet MS',
    c.fillText('Evolution of Hype', 283, 570);

    // init color spectrum
    for (e = 256; e--;)
        spectrum[e] = 0;

    // update nodes and waves, draw waves
    nodes.some(function (node) {
        // move node
        node.x += node.vx *= .9;
        node.y += node.vy *= .9;

        // update hype or move node back to origin
        node.hyped ? node.hyped-- : (
            node.x += (node.node.x - node.x) / 500,
            node.y += (node.node.y - node.y) / 500
        ),

        // analize colors
        e = node.color, spectrum[e]++,

        // update hype wave
        node.wave && (
            // hype touched nodes
            nodes.some(function (e, f) {
                e.hyped ||
                    abs(sqrt((x = e.x - node.x) * x + (y = e.y - node.y) * y, 2) - node.wave) < 2 &&
                        3 * random() < 1 - abs(e.color - node.color) / 256 &&
                        startHype(node, e)
            }),

            // draw hype wave
            c.beginPath(),
            c.arc(node.x, node.y, node.wave, 0, 7, 0),
            e = node.color, c.fillStyle = c.strokeStyle = 'rgba(' + [255, 255 - e, e, 1 / 7] + ')',
            c.fill(),
            e = node.color, c.fillStyle = c.strokeStyle = 'rgba(' + [255, 255 - e, e, 1 / 3] + ')',
            c.stroke(),

            // stop wave
            ++node.wave > node.radius * 10
                && (node.wave = 0)
        )
    });

    // draw spectrum
    for (e = 256; e--;)
        c.fillStyle = c.strokeStyle = 'rgba(' + [255, 255 - e, e, 1] + ')',
        c.fillRect(147 + e * 2, 610 - spectrum[e] * 2, 2, spectrum[e] * 2);

    // draw line
    c.fillStyle = '#fff',
    c.fillRect(137, 610, 530, 1),

    // draw nodes
    nodes.some(function (node) {
        c.beginPath(),
        c.arc(node.x + node.hyped * random() / 100, node.y + node.hyped * random() / 100, node.radius, 0, 7, 0),
        e = node.color, c.shadowColor = c.fillStyle = c.strokeStyle = 'rgba(' + [255, 255 - e, e, 1] + ')',
        c.shadowBlur = node.radius * 3;
        c.fill()
    })
}, 33)
