// config
var
    // size for area with nodes
    gridWidth = a.width,
    gridHeight = a.height,
    // top and left offset
    gridOffset = 20,

    // space between nodes
    nodeSpread = 30,
    // randomized deviation from the grid
    nodeDeviation = 16,

    // boost for new waves
    waveBoost = 1,
    // reduction when wave hits node with lower score
    waveDrop = 1.5,

    // simulation speed
    fps = 30;

var nodes,
    hypeWaves,
    rand = Math.random;

function createNode(x, y) {
    return {
        x: x * nodeSpread + gridOffset + (rand() - .5) * nodeDeviation,
        y: y * nodeSpread + gridOffset + (rand() - .5) * nodeDeviation,
        level: rand() < 0.5 ? 1 : rand() < 0.7 ? 2 : 3,
        hyped: 0,
        r: 8,
        distance: function (p) {
            var x = this.x - p.x,
                y = this.y - p.y;
            return Math.sqrt(x * x + y * y, 2);
        },
        tryHype: function (wave) {
            if (this.hyped) return;
            if (this.level > wave.level()) return;
            if (this.level < wave.level()) {
                wave._level -= waveDrop;
            }
            this.hype(wave);
        },
        hype: function (wave) {
            this.hyped = 1;
            hypeWaves.push(w = createWave(this, wave));
        }
    }
}

function createWave(node, wave) {
    var level = Math.min(wave._level + waveBoost, 5);
    return {
        x: node.x,
        y: node.y,
        r: 8,
        rMax: 18 + level * 5,
        _level: level,
        level: function () {
            return Math.max(this._level + 1 >> 1, 1);
        }
    }
}

function setup() {
    var x, y,
        columns = (gridWidth - gridOffset * 2) / nodeSpread + 1 | 0,
        rows = (gridHeight - gridOffset * 2) / nodeSpread + 1 | 0;
    nodes = [];
    hypeWaves = [];
    for (y = rows; y--;) {
        for (x = columns; x--;) {
            if (rand() < .2) continue;
            nodes.push(createNode(x, y));
        }
    }
    setInterval(update, 1000 / fps | 0);
}

function draw() {
    var x, y;
    c.font = '27px Arial';
    c.textAlign = 'center';
    c.fillStyle = '#000';
    c.fillRect(0, 0, a.width, a.height);

    nodes.forEach(function (node) {
        c.beginPath();
        x = node.x + (node.hyped && rand());
        y = node.y + (node.hyped && rand());
        c.arc(x, y, node.r, 0, 7, 0);
        c.fillStyle = '#' + ['fff', 'afa', 'ffa', 'faa'][node.hyped ? 0 : node.level];
        c.fill();
        c.fillStyle = '#000';
        c.fillText('☺', x, y + 7);
    });

    hypeWaves.forEach(function (wave) {
        c.beginPath();
        c.arc(wave.x, wave.y, wave.r, 0, 7, 0);
        c.strokeStyle = '#' + ['0f0', 'ff0', 'f00'][wave.level() - 1];
        c.stroke(); 
    });
}

function update() {
    hypeWaves.forEach(function (wave) {
        wave.r++;
        nodes.forEach(function (node) {
            if (Math.abs(node.distance(wave) - wave.r) < 0.5) {
                node.tryHype(wave);
            }
        });
    });
    hypeWaves = hypeWaves.filter(function (wave) {
        return wave.level() > 0 && wave.r < wave.rMax;
    });
    draw();
}

function reset() {
    nodes.forEach(function (node) {
        node.hyped = 0;
    });
}

document.onclick = function (e) {
    var mouse = {x: e.pageX, y: e.pageY};
    nodes.some(function (node) {
        if (node.level == 1 && node.distance(mouse) <= node.r) {
            node.hype({level: function () { return 0; }, _level: 0});
            return true;
        }
    });
};

setup();
