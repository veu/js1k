// whether instructions are visible
showInstructions =
// ticks since last hype started
idle = 150,

// node information: position, color, hype, ...
nodes = [],

onclick = function (e, f) {
    // hide instructions
    showInstructions =
        // check if we clicked on a node
        nodes.some(function (node) {
            Math.sqrt((x = node.x - e.pageX / cScale + offset) * x + (y = node.y - e.pageY / cScale) * y) > node.radius
                || startHype(node, node)
        })
},

startHype = function (e, f) {
    // adopt color with slight mutation
    f.color = e.color + (f.color - e.color) / 10 * Math.random() + 10 * Math.random() - 5 | 0,
    // move hypee closer to hyper
    f.vx = (e.x - f.x) / 25,
    f.vy = (e.y - f.y) / 25,
    // set hype length
    f.e = 200,
    // reset idle cooldown
    idle =
    // start hype wave
    f.wave = 1
},

// setup grid
e = 600; while (e--) {
    nodes.push({
        // node color
        color: 256 * Math.random() | 0,
        // position
        x: e % 30 * 25 + 30 + 20 * Math.random(),
        y: (e / 30 | 0) * 25 + 30 + 20 * Math.random(),
        // speed
        vx: 0, vy: 0,
        // hype (shaking animation)
        e: 0,
        // hype wave radius
        wave: time = 0,
        // node radius
        radius: 5 * Math.random() + 1 | 0
    })
}

// remember original node positions
nodes.some(function (node) {
    node.node = {x: node.x, y: node.y}
}),

(update = function (e, f) {
    requestAnimationFrame(update),

    e - time > 30 && (function (e, f) {
        time = e,

        // start new hype after a cooldown
        ++idle - 200 ||
            startHype(node = nodes[256 * Math.random() | 0], node),

        // reset context state, reset color spectrum, and draw background
        c.fillRect(spectrum = [], 0, a.width = a.width, a.height),
        // scale canvas to demo size
        c.scale(cScale = Math.min(a.width / 804, a.height / 640), cScale),
        // center demo
        c.translate(offset = (a.width / cScale - 804) / 2, 0),

        // draw instruction
        c.fillStyle = '#fff',
        showInstructions &&
            c.fillText('Click a circle to hype it', 345, 590),


        // draw title
        c.font = '30px Trebuchet MS',
        c.fillText('Evolution of Hype', 283, 570),

        // init color spectrum
        e = 256; while(e--) {
            spectrum[e] = 0
        }

        // update nodes and waves
        nodes.some(function (node) {
            // move node
            node.x += node.vx *= .9,
            node.y += node.vy *= .9,

            // update hype or move node back to origin
            node.e ? node.e-- : (
                node.x += (node.node.x - node.x) / 500,
                node.y += (node.node.y - node.y) / 500
            ),

            // analize colors
            e = node.color, spectrum[e]++,

            // update hype wave
            node.wave && (
                e = node,
                // hype infecting new nodes
                nodes.some(function (node) {
                    node.e ||
                        Math.abs(Math.sqrt((x = node.x - e.x) * x + (y = node.y - e.y) * y, 2) - e.wave) < 2 &&
                            node.radius * Math.random() < 1 - Math.abs(node.color - e.color) / 256 &&
                            startHype(e, node)
                }),

                // draw hype wave
                e = node.color, c.fillStyle = 'rgba(' + [255, 255 - e, e, 1 / 7],
                c.beginPath(),
                c.arc(node.x, node.y, node.wave, 0, 7, 0),
                c.fill(),
                e = node.color, c.strokeStyle = 'rgba(' + [255, 255 - e, e, 1 / 3],
                c.stroke(),

                // stop wave
                ++node.wave > node.radius * 10
                    && (node.wave = 0)
            )
        }),

        // draw spectrum
        e = 256; while (e--) {
            c.fillStyle = 'rgba(' + [255, 255 - e, e, 1],
            c.fillRect(147 + e * 2, 610 - Math.log(spectrum[e]) * 5, 2, Math.log(spectrum[e]) * 5)
        }

        // draw line
        c.fillStyle = '#fff',
        c.fillRect(137, 610, 530, 1),

        // draw nodes
        nodes.some(function (node) {
            e = node.color, c.shadowColor = c.fillStyle = 'rgba(' + [255, 255 - e, e, 1],
            c.shadowBlur = node.radius * 3,
            c.beginPath(),
            c.arc(node.x + node.e * Math.random() / 100, node.y + node.e * Math.random() / 100, node.radius, 0, 7, 0),
            c.fill()
        })
    })(e)
})()
