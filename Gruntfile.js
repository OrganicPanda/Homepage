module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		// Read the package.json
		pkg: grunt.file.readJSON('package.json'),

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
					cwd: '<%= meta.srcPath %>font',
					src: ['**'],
					dest: '<%= meta.buildPath %>font'
				}, {					
					expand: true, 
					cwd: '<%= meta.srcPath %>image',
					src: ['apple-touch-icon.png', 'favicon.ico'], 
					dest: '<%= meta.buildPath %>'
				}]
			}
		},

		compass: {
			main: {
				options: {
					sassDir: '<%= meta.srcPath %>sass',
					cssDir: '<%= meta.buildPath %>css',
					imagesPath: '<%= meta.srcPath %>sass/images',
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
			scripts: {

				// When these files change
				files: ['<%= meta.srcPath %>/**/*.scss'],

				// Do this
				tasks: ['compass']

			},
			jekyll: {

				// When these files change
				files: ['<%= meta.srcPath %>jekyll/**/*.*'],

				// Do this
				tasks: ['build']

			}
		},
		
		devserver : { 
			options: {
				'port' : 8000,
				'base' : './build'
			}
		}

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-devserver');

	// Create aliases
	grunt.registerTask('server', ['devserver']);
	grunt.registerTask('build', ['jekyll', 'compass', 'copy']);
	grunt.registerTask('default', ['build', 'watch']);

};