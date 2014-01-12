module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('grunt-aws.json'),

    // Metadata.
    meta: {
      basePath: '',
      srcPath: 'src/',
      buildPath: 'build/'
    },

    copy: {
      main: {
        files: [{
          expand: true,
          cwd: '<%= meta.srcPath %>script',
          src: ['**'],
          dest: '<%= meta.buildPath %>script'
        }, {
          expand: true,
          cwd: '<%= meta.srcPath %>font',
          src: ['**'],
          dest: '<%= meta.buildPath %>font'
        }, {
          expand: true,
          cwd: '<%= meta.srcPath %>image',
          src: ['apple-touch-icon.png', 'favicon.ico'],
          dest: '<%= meta.buildPath %>'
        }, {
          expand: true,
          cwd: '<%= meta.srcPath %>image',
          src: ['**'],
          dest: '<%= meta.buildPath %>image'
        }, {
          expand: true,
          cwd: '<%= meta.srcPath %>css',
          src: ['**'],
          dest: '<%= meta.buildPath %>css'
        }]
      }
    },

    compass: {
      main: {
        options: {
          sassDir: '<%= meta.srcPath %>css',
          cssDir: '<%= meta.buildPath %>css',
          imagesPath: '<%= meta.srcPath %>image',
          outputStyle: 'compressed'
        }
      }
    },

    jekyll: {                             // Task
      options: {                          // Universal options
        src : '<%= meta.srcPath %>jekyll/organicpanda'
      },
      dist: {                             // Target
        options: {                        // Target options
          dest: '<%= meta.buildPath %>',
          config: '<%= meta.srcPath %>jekyll/organicpanda/_config.yml'
        }
      }
    },

    watch: {
      sass: {
        files: ['<%= meta.srcPath %>/**/*.scss'],
        tasks: ['compass']
      },
      js: {
        files: ['<%= meta.srcPath %>/**/*.js'],
        tasks: ['jshint', 'copy']
      },
      assets: {
        files: [
          '<%= meta.srcPath %>/**/*.css',
          '<%= meta.srcPath %>image/**/*.*'
        ],
        tasks: ['copy']
      },
      jekyll: {
        files: ['<%= meta.srcPath %>jekyll/**/*.*'],
        tasks: ['build']
      }
    },

    devserver : {
      options: {
        'port' : 8000,
        'base' : './build'
      }
    },

    s3: {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        bucket: '<%= aws.bucket %>',
        access: 'public-read',
        region: 'eu-west-1',
        headers: {
          // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
          //"Cache-Control": "max-age=630720000, public",
          //"Expires": new Date(Date.now() + 63072000000).toUTCString()
        }
      },
      production: {
        upload: [{
          src: '<%= meta.buildPath %>/**/*.*',
          dest: '/',
          rel: '<%= meta.buildPath %>',
          options: { gzip: true },
        }]
      }

    },

    jshint: {
      options: {
        jshintrc: true
      },
      all: [
        'Gruntfile.js',
        '<%= meta.srcPath %>script/*.js',
        '!<%= meta.srcPath %>script/prism.js',
        '!<%= meta.srcPath %>script/RequestAnimationFrame.js',
        '!<%= meta.srcPath %>script/html5shiv.js',
        '!<%= meta.srcPath %>script/Function.bind.js'
      ]
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-devserver');
  grunt.loadNpmTasks('grunt-s3');

  // Create aliases
  grunt.registerTask('server', ['devserver']);
  grunt.registerTask('build', ['jshint', 'jekyll', 'compass', 'copy']);
  grunt.registerTask('deploy', ['build', 's3']);
  grunt.registerTask('default', ['build', 'watch']);
};