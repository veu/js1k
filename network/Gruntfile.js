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
          globalVariables: '',
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

  grunt.registerTask('default', ['uglify', 'regpack']);

};
