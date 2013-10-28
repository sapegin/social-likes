// gruntjs.com
 
/*jshint node:true*/
module.exports = function(grunt) {
	'use strict';

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		cmpnt: grunt.file.readJSON('../bower.json'),
		banner: '/*! Social Likes v<%= cmpnt.version %> by Artem Sapegin - ' +
				'http://sapegin.github.com/social-likes - Licensed MIT */\n',
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			files: [
				'grunt.js',
				'social-likes.js'
			]
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: 'social-likes.js',
				dest: '../social-likes.min.js'
			}
		},
		stylus: {
			compile: {
				files: {
					'../social-likes_flat.css': 'styles/flat/index.styl',
					'../social-likes_classic.css': 'styles/classic/index.styl'
				},
				options: {
					'urlfunc': 'embedurl'
				}
			},
			contrib: {
				files: {
					'../contrib/css/github.css': '../contrib/styles/github.styl',
					'../contrib/css/livejournal.css': '../contrib/styles/livejournal.styl'
				},
				options: {
					'urlfunc': 'embedurl',
					'compress': false
				}
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 2 version', 'ie 8']
			},
			dist: {
				expand: true,
				flatten: true,
				src: '../*.css',
				dest: '../'
			},
			contrib: {
				expand: true,
				flatten: true,
				src: '../contrib/css/*.css',
				dest: '../contrib/css/'
			}
		},
		csso: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				expand: true,
				flatten: true,
				src: '../*.css',
				dest: '../'
			}
		},
		webfont: {
			flat: {
				src: 'styles/flat/icons/*.svg',
				dest: 'styles/flat/font/',
				options: {
					font: 'social-likes',
					types: 'woff,ttf',
					embed: true,
					template: 'styles/flat/webfont.styl',
					stylesheet: 'styl',
					relativeFontPath: '',
					hashes: false,
					htmlDemo: false
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			stylus: {
				files: 'styles/**',
				tasks: ['stylus:compile', 'autoprefixer']
			}
		},
		imgo: {
			imgo: {
				src: 'icons/*.png'
			}
		}
	});

	grunt.registerTask('default', ['jshint', 'uglify', 'imgo', 'webfont', 'stylus', 'autoprefixer', 'csso']);
	grunt.registerTask('build', ['uglify', 'imgo', 'webfont', 'stylus', 'autoprefixer', 'csso']);

};