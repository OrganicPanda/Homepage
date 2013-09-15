module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		// Read the package.json
		pkg: grunt.file.readJSON('package.json'),

		// Load in the external Amazon S3 config
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
			sass: {

				// When these files change
				files: ['<%= meta.srcPath %>/**/*.scss'],

				// Do this
				tasks: ['compass']

			},
			script: {

				// When these files change
				files: ['<%= meta.srcPath %>/**/*.js'],

				// Do this
				tasks: ['copy']

			},
			image: {

				// When these files change
				files: ['<%= meta.srcPath %>image/**/*.*'],

				// Do this
				tasks: ['copy']

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
		},

		s3: {
			options: {
				key: '<%= aws.key %>',
				secret: '<%= aws.secret %>',
				bucket: '<%= aws.bucket %>',
				access: 'public-read',
				region: "eu-west-1",
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
					options: { gzip: true }
  				}]
			}

		}

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-devserver');
	grunt.loadNpmTasks('grunt-s3');

	// Create aliases
	grunt.registerTask('server', ['devserver']);
	grunt.registerTask('build', ['jekyll', 'compass', 'copy']);
	grunt.registerTask('deploy', ['build', 's3']);
	grunt.registerTask('default', ['build', 'watch']);

};