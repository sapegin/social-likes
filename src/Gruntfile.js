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
			options: {
				config: ".jscs.json"
			},
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
					function() { return require('autoprefixer-stylus')({browsers: ['last 2 versions', 'ie 8']}); }
				]
			},
			compile: {
				files: {
					'../social-likes_flat.css': 'styles/flat/index.styl',
					'../social-likes_classic.css': 'styles/classic/index.styl',
					'../social-likes_birman.css': 'styles/birman/index.styl'
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
					types: 'woff',
					embed: 'woff',
					template: 'styles/flat/webfont.styl',
					stylesheet: 'styl',
					hashes: false,
					htmlDemo: false,
					startCodepoint: 0xF101
				}
			}
		},
		imagemin: {
			options: {
				pngquant: true
			},
			classic: {
				files: [
					{
						expand: true,
						cwd: 'styles/classic/icons_src/',
						src: '*.png',
						dest: 'styles/classic/icons/'
					}
				]
			},
			birman: {
				files: [
					{
						expand: true,
						cwd: 'styles/birman/icons_src/',
						src: '*.png',
						dest: 'styles/birman/icons/'
					}
				]
			}
		},
		watch: {
			options: {
				livereload: true
			},
			stylus: {
				options: {
					atBegin: true
				},
				files: 'styles/**',
				tasks: ['stylus:compile']
			}
		}
	});

	grunt.registerTask('default', ['jshint', 'jscs', 'uglify', 'imagemin', 'webfont', 'stylus', 'csso']);
	grunt.registerTask('build', ['uglify', 'imagemin', 'webfont', 'stylus', 'csso']);

};