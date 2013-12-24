// gruntjs.com
 
/*jshint node:true*/
module.exports = function(grunt) {
	'use strict';

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		cmpnt: grunt.file.readJSON('../bower.json'),
		banner: '/*! Social Likes v<%= cmpnt.version %> by Artem Sapegin - ' +
				'http://sapegin.github.com/social-likes - Licensed MIT */\n',
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			files: ['social-likes.js']
		},
		jscs: {
			files: ['<%= jshint.files %>']
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
			options: {
				urlfunc: 'embedurl',
				use: [
					function() { return require('autoprefixer-stylus')('last 2 versions', 'ie 8'); }
				]
			},
			compile: {
				files: {
					'../social-likes.css': 'styles/flat/index.styl',
					'../social-likes_classic.css': 'styles/classic/index.styl',
					'../specs/social-likes_all.css': 'styles/all.styl'
				}
			},
			contrib: {
				options: {
					compress: false
				},
				files: {
					'../contrib/css/github.css': '../contrib/styles/github.styl',
					'../contrib/css/livejournal.css': '../contrib/styles/livejournal.styl'
				}
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
				dest: 'styles/flat/font',
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
		imagemin: {
			options: {
				pngquant: true
			},
			main: {
				files: [
					{
						expand: true,
						cwd: 'styles/classic/icons_src/',
						src: '*.png',
						dest: 'styles/classic/icons/'
					}
				]
			}
		},
		watch: {
			options: {
				livereload: true
			},
			stylus: {
				files: 'styles/**',
				tasks: ['stylus:compile']
			}
		}
	});

	grunt.registerTask('default', ['jshint', 'jscs', 'uglify', 'imagemin', 'webfont', 'stylus', 'csso']);
	grunt.registerTask('build', ['uglify', 'imagemin', 'webfont', 'stylus', 'csso']);

};