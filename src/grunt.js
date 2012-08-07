/**
How to build this project?

1. Install Grunt:
  npm install grunt -g
  mkdir node_modules
  npm install grunt-stylus grunt-imgo

2. Build:
  grunt
*/

/*global module:false*/
module.exports = function(grunt) {
	'use strict';

	// Project configuration
	grunt.initConfig({
		meta: {
			version: '2.0.0 alpha',
			banner: "/*! Social Likes v<%= meta.version %> by Artem Sapegin - " +
					"http://sapegin.github.com/social-likes - " +
					"Licensed MIT */"
		},
		lint: {
			files: [
				'grunt.js',
				'social-likes.js'
			]
		},
		min: {
			dist: {
				src: ['<banner:meta.banner>', 'social-likes.js'],
				dest: '../social-likes.min.js'
			}
		},
		stylus: {
			compile: {
				files: {
					'../social-likes.css': 'styles/index.styl'
				},
				options: {
					'compress': true,
					'include css': true,
					'urlfunc': 'embedurl',
					'paths': ['styles']
				}
			}
		},
		watch: {
			stylus: {
				files: 'styles/**',
				tasks: 'stylus'
			}
		},
		jshint: {
			options: {
				browser: true,
				white: false,
				smarttabs: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				undef: true
			},
			globals: {
				jQuery: true}
		},
		imgo: {
			imgo: {
				files: 'icons/*.png'
			}
		},
		uglify: {}
	});

	grunt.loadNpmTasks('grunt-stylus');
	grunt.loadNpmTasks('grunt-imgo');

	// Default task
	grunt.registerTask('default', 'lint min imgo stylus');

};