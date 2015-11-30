'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      src: [
        'Gruntfile.js', './client/js/app.js', 'server/**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc'
      }
    },
    nodemon: {
      dev: {
        script: 'server/index.js'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
    docco: {
      debug: {
        src: ['client/**/*.js', 'server/**/*.js'],
        options: {
          output: 'docs/'
        }
      }
    }
  });

  // Load npm tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-docco');

  // Default task(s).
  grunt.registerTask('default', [
    'jshint',
    'mochaTest',
    'run'
  ]);
  grunt.registerTask('doccify', ['docco']);
  grunt.registerTask('run', ['nodemon']);
  grunt.registerTask('test', ['mochaTest']);


};
