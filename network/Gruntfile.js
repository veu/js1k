module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        mangle: {
            toplevel: true,
            screw_ie8: true
        }
      },
      build: {
        src: 'demo.js',
        dest: 'build/demo.min.js'
      }
    },
    regpack: {
      firstTask: {
        options: {
          globalVariables: 'a',
          separator: ''
        },
        files: [
          {
            src: [
              'build/demo.min.js'
            ],
            dest: 'build/demo.zip.js'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-regpack');

  grunt.registerTask('copy-shim', function() {
    var fs = require('fs'),
        demo = fs.readFileSync('build/demo.min.js', {encoding: 'utf8'}),
        shim = fs.readFileSync('shim.html', {encoding: 'utf8'});
    shim = shim.replace('%DEMO%', demo);
    fs.writeFileSync('build/shim.html', shim);
  });

  grunt.registerTask('default', ['uglify', 'regpack', 'copy-shim']);

};