var extend = require('extend');

module.exports = function (grunt) {
  require('google-closure-compiler').grunt(grunt);

  var compilerOptions = {
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    warning_level: 'VERBOSE',
    summary_detail_level: 3,
    language_in: 'ECMASCRIPT5_STRICT',
    output_wrapper: '(function(){%output%}());',
    use_types_for_optimization: true,
    externs: ['externs-commonjs.js']
  };

  var src = [
    'node_modules/closure-dom/src/dom.js',
    'src/descriptors.js',
    'src/ruler.js',
    'src/observer.js',
    'exports.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      options: {
        force: true
      },
      build: ['build']
    },
    exec: {
      test: 'phantomjs node_modules/mocha-phantomjs-core/mocha-phantomjs-core.js test/index.html',
      deps: 'calcdeps -i src -i exports.js -p src -p ./vendor/google/base.js -p node_modules/closure-dom/src/dom.js -o deps > test/deps.js'
    },
    jshint: {
      all: ['src/**/*.js'],
      options: {
        // ... better written as dot notation
        '-W069': true,

        // type definitions
        '-W030': true,

        // Don't make functions within loops
        '-W083': true,

        // Wrap the /regexp/ literal in parens to disambiguate the slash operator
        '-W092': true
      }
    },
    'closure-compiler': {
      dist: {
        files: {
          'fontfaceobserver.js': src
        },
        options: compilerOptions
      },
      compile: {
        files: {
          'build/fontfaceobserver.js': src
        },
        options: compilerOptions
      },
      debug: {
        files: {
          'build/fontfaceobserver.debug.js': src
        },
        options: extend({}, compilerOptions, {
          debug: true,
          formatting: ['PRETTY_PRINT', 'PRINT_INPUT_DELIMITER']
        })
      }
    },
    concat: {
      options: {
        banner: '/* Font Face Observer v<%= pkg.version %> - © Bram Stein. License: BSD-3-Clause */'
      },
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

  grunt.registerTask('compile', ['closure-compiler:compile']);
  grunt.registerTask('debug', ['closure-compiler:debug']);
  grunt.registerTask('default', ['compile']);
  grunt.registerTask('test', ['jshint', 'exec:test']);
  grunt.registerTask('dist', ['clean', 'closure-compiler:compile', 'concat:dist', 'concat:dist_promises']);
};
