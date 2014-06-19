/*
 * grunt-cmd-transport
 * https://github.com/spmjs/grunt-cmd-transport
 *
 * Copyright (c) 2013 Hsiaoming Yang
 * Licensed under the MIT license.
 */


module.exports = function(grunt) {

  var style = require('./').style.init(grunt);
  var css2jsParser = style.css2jsParser;
  var jsParser = require('./').script.init(grunt).jsParser;

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        '<%= mochaTest.test.src %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    clean: {
      expected: ['test/expected']
    },

    transport: {
      expand: {
        files: [{
          expand: true,
          cwd: 'test/cases/expand',
          src: '**/*',
          dest: 'test/expected/expand'
        }]
      },

      // single file without any dependencies
      single: {
        // learn file object at:
        // http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
        files: [{
          expand: true,
          cwd: 'test/cases/single',
          src: '**/*.js',
          filter: 'isFile',
          dest: 'test/expected/single'
        }]
      },

      // single file with cmd id format
      cmdid: {
        options: {
          // you can read these from a package.json
          idleading: 'family/name/1.0.0/'
        },
        files: [{
          expand: true,
          cwd: 'test/cases/cmdid',
          src: '*.js',
          dest: 'test/expected/cmdid'
        }]
      },

      // relative dependencies
      relative: {
        files: [{
          expand: true,
          cwd: 'test/cases/relative',
          src: '**/*.js',
          dest: 'test/expected/relative'
        }]
      },

      // nested relative dependencies
      nested: {
        options: {
          debug: false
        },
        files: [{
          expand: true,
          cwd: 'test/cases/nested',
          src: '**/*.js',
          filter: 'isFile',
          dest: 'test/expected/nested'
        }]
      },

      // rely on other modules
      rely: {
        options: {
          paths: ['test/cases/assets']
        },
        files: [{
          expand: true,
          cwd: 'test/cases/rely-arale',
          src: '*.js',
          dest: 'test/expected/rely-arale'
        }]
      },

      // reply on other modules (with alias)
      alias: {
        options: {
          paths: ['test/cases/assets'],
          alias: {
            'foo': 'arale/class/foo',
            '$': '$'
          }
        },
        files: [{
          expand: true,
          cwd: 'test/cases/alias',
          src: '*.js',
          dest: 'test/expected/alias'
        }]
      },

      // parsing css
      css: {
        options: {
          alias: {
            'button': 'alice/button/1.0.0/button.css'
          }
        },
        files: [{
          expand: true,
          cwd: 'test/cases/css',
          src: '*.css',
          dest: 'test/expected/css'
        }]
      },

      // parsing html into js
      text: {
        files: [{
          expand: true,
          cwd: 'test/cases/text',
          src: '*.html',
          dest: 'test/expected/text'
        }]
      },

      // parsing handlebars into js
      handlebars: {
        files: [{
          expand: true,
          cwd: 'test/cases/handlebars',
          src: '*.handlebars',
          dest: 'test/expected/handlebars'
        }]
      },

      // parsing tpl into js
      tpl: {
        files: [{
          expand: true,
          cwd: 'test/cases/tpl',
          src: '*.tpl',
          dest: 'test/expected/tpl'
        }]
      },

      css2js: {
        options: {
          parsers: {
            '.css': [css2jsParser]
          }
        },
        files: [{
          expand: true,
          cwd: 'test/cases/css2js',
          src: '*.css',
          dest: 'test/expected/css2js'
        }]
      },

      style: {
        options: {
          parsers: {
            '.css': [css2jsParser],
            '.js': [jsParser]
          },
          styleBox: ["a.css"],
          idleading: 'arale/widget/1.0.0/'
        },
        files: [{
          expand: true,
          cwd: 'test/cases/style',
          src: '*.{js,css}',
          dest: 'test/expected/style'
        }]
      },

      duplicate: {
        files: [{
          expand: true,
          cwd: 'test/cases/duplicate',
          src: '**/*.js',
          dest: 'test/expected/duplicate'
        }]
      },

      json: {
        files: [{
          expand: true,
          cwd: 'test/cases/json',
          src: '*.json',
          dest: 'test/expected/json'
        }]
      },

      'id-deps-exist': {
        options: {
          paths: ['test/cases/assets'],
          alias: {
            'foo': 'arale/class/foo'
          }
        },
        files: [{
          expand: true,
          cwd: 'test/cases/id-deps-exist',
          src: '*.js',
          dest: 'test/expected/id-deps-exist'
        }]
      },

      'text!': {
        files: [{
          expand: true,
          cwd: 'test/cases/text!',
          src: '*.js',
          dest: 'test/expected/text!'
        }]
      },

      'directory': {
        options: {
          debug: false
        },
        files: [{
          expand: true,
          cwd: 'test/cases/directory',
          src: '**/*.js',
          dest: 'test/expected/directory'
        }]
      }
    },

    // Unit tests.
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/transport.js']
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', ['clean', 'transport', 'mochaTest', 'clean']);

};
