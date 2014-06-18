/*
 * grunt-cmd-concat
 * https://github.com/spmjs/grunt-cmd-concat
 *
 * Copyright (c) 2013 Hsiaoming Yang
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    concat: {
      self: {
        files: {
          'tmp/self.js': ['demo/self.js', 'demo/relative.js']
        }
      },

      relative: {
        options: {
          include: 'relative'
        },
        files: {
          // it will auto concat demo/self.js
          'tmp/relative.js': ['demo/relative.js']
        }
      },

      all: {
        options: {
          include: 'all',
          // the modules path
          paths: ['assets']
        },
        files: {
          // it will include all dependencies
          // demo/all.js demo/relative.js demo/self.js assets/foo.js
          'tmp/all.js': ['demo/all.js']
        }
      },

      css: {
        options: {
          include: 'all'
        },
        files: [{
          cwd: 'tmp/css/transport',
          src: '**/*.css',
          expand: true,
          dest: 'tmp/css/concat'
        }]
      }
    },

    transport: {
      css: {
        files: [{
          cwd: 'css',
          src: '**/*.css',
          dest: 'tmp/css/transport'
        }]
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('../tasks');

  grunt.loadNpmTasks('grunt-cmd-transport')

  // By default, lint and run all tests.
  grunt.registerTask('default', ['concat']);

};
