var extend = require('extend');

module.exports = function (grunt) {
  var compilerOptions = {
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    warning_level: 'VERBOSE',
    summary_detail_level: 3,
    language_in: 'ECMASCRIPT5_STRICT',
    output_wrapper: '(function(){%output%}());',
    use_types_for_optimization: true,
    externs: ['externs-commonjs.js']
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['build'],
    connect: {
      server: {
        options: {
          base: "",
          port: 9999
        }
      }
    },
    watch: {},
    exec: {
      test: 'phantomjs node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js test/index.html',
      deps: 'calcdeps -i src -i exports.js -p src -p ./vendor/google/base.js -p node_modules/closure-dom/src/dom.js -o deps > test/deps.js'
    },
    jshint: {
      all: ['src/**/*.js'],
      options: {
        // ... better written as dot notation
        "-W069": true,

        // type definitions
        "-W030": true,

        // Don't make functions within loops
        "-W083": true,

        // Wrap the /regexp/ literal in parens to disambiguate the slash operator
        "-W092": true
      }
    },
    closurecompiler: {
      dist: {
        files: {
          "fontfaceobserver.js": ['src/**/*.js', 'exports.js', 'node_modules/closure-dom/src/dom.js']
        },
        options: extend({}, compilerOptions, {
          define: "DEBUG=false"
        })
      },
      compile: {
        files: {
          "build/fontfaceobserver.js": ['src/**/*.js', 'exports.js', 'node_modules/closure-dom/src/dom.js'],
        },
        options: extend({}, compilerOptions, {
          define: "DEBUG=false"
        })
      },
      debug: {
        files: {
          "build/fontfaceobserver.debug.js": ['src/**/*.js', 'exports.js', 'node_modules/closure-dom/src/dom.js']
        },
        options: extend({}, compilerOptions, {
          debug: true,
          formatting: ['PRETTY_PRINT', 'PRINT_INPUT_DELIMITER']
        })
      }
    },
    concat: {
      dist_promises: {
        src: ['node_modules/promis/promise.js', 'build/fontfaceobserver.js'],
        dest: 'fontfaceobserver.js'
      },
      dist: {
        src: ['build/fontfaceobserver.js'],
        dest: 'fontfaceobserver.standalone.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-closurecompiler');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('compile', ['closurecompiler:compile']);
  grunt.registerTask('debug', ['closurecompiler:debug']);
  grunt.registerTask('default', ['compile']);
  grunt.registerTask('test', ['exec:test']);
  grunt.registerTask('dist', ['clean', 'closurecompiler:compile', 'concat:dist', 'concat:dist_promises']);
};
