module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        mangle: false,
        compress: false
      },
      build: {
        src: 'demo.js',
        dest: 'build/demo.min.js'
      }
    },
    mangle: {
      reserved: 'acefxyE',
      names: [
        'color',
        'cScale',
        'hyped',
        'idle',
        'node',
        'nodes',
        'offset',
        'radius',
        'showInstructions',
        'spectrum',
        'startHype',
        'time',
        'update',
        'vx',
        'vy',
        'wave'
      ]
    },
    regpack: {
      firstTask: {
        options: {
          globalVariables: 'ac',
          separator: ''
        },
        files: [
          {
            src: [
              'build/demo.mng.js'
            ],
            dest: 'build/demo.zip.js'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-regpack');

  grunt.registerTask('mangle', function() {
    var fs = require('fs'),
      names = grunt.config('mangle.names'),
      reserved = grunt.config('mangle.reserved'),
      charUsage = {},
      chars, data;

    data = fs.readFileSync('build/demo.min.js', {encoding: 'utf8'});
    for (var i = 65; i < 91; i++) charUsage[String.fromCharCode(i)] = 0;
    for (var i = 97; i < 123; i++) charUsage[String.fromCharCode(i)] = 0;
    reserved.split('').forEach(function (c) {
        delete charUsage[c];
    });
    data.split('').forEach(function (c) {
      if (c in charUsage) charUsage[c]++;
    });
    chars = Object.keys(charUsage);
    chars.sort(function (a, b) { return charUsage[b] - charUsage[a] });

    grunt.log.writeln('Free characters: ' + chars.join(''));
    if (chars.length < names.length) {
      grunt.log.error('Not enough characters to shorten all names!');
    }
    grunt.log.writeln('Used characters: ' + chars.join('').substr(0, names.length));

    names.forEach(function (name) {
      var c = chars.shift(),
          re = new RegExp('\\b' + name + '\\b', 'g');

      data = data.replace(re, c);
    });
    fs.writeFileSync('build/demo.mng.js', data);
  });

  grunt.registerTask('compile', function() {
    var fs = require('fs'),
        demo = fs.readFileSync('build/demo.zip.js'),
        shim = fs.readFileSync('shim.html', {encoding: 'utf8'}),
        base64 = new Buffer(demo).toString('base64')
    fs.writeFileSync('build/demo.txt', base64);
    shim = shim.split('%DEMO%').join(demo);
    fs.writeFileSync('build/shim.html', shim);
  });

  grunt.registerTask('default', ['uglify', 'mangle', 'regpack', 'compile']);

};
