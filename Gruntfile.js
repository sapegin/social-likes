// gruntjs.com

/*jshint node:true*/
module.exports = function(grunt) {
	'use strict';

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: require('./package.json'),
		banner:
			'/*! Social Likes v<%= pkg.version %> by Artem Sapegin - ' +
			'http://sapegin.github.com/social-likes - Licensed MIT */\n',
		uglify: {
			options: {
				banner: '<%= banner %>',
			},
			dist: {
				src: 'src/social-likes.js',
				dest: 'dist/social-likes.min.js',
			},
		},
		stylus: {
			options: {
				urlfunc: 'embedurl',
				use: [
					function() {
						return require('autoprefixer-stylus')({ browsers: ['last 2 versions', 'ie 8'] });
					},
				],
			},
			compile: {
				files: {
					'dist/social-likes_flat.css': 'src/styles/flat/index.styl',
					'dist/social-likes_classic.css': 'src/styles/classic/index.styl',
					'dist/social-likes_birman.css': 'src/styles/birman/index.styl',
				},
			},
			contrib: {
				options: {
					compress: false,
				},
				files: {
					'contrib/css/github.css': 'contrib/styles/github.styl',
					'contrib/css/livejournal.css': 'contrib/styles/livejournal.styl',
				},
			},
		},
		csso: {
			options: {
				banner: '<%= banner %>',
			},
			dist: {
				expand: true,
				flatten: true,
				src: 'dist/*.css',
				dest: 'dist',
			},
		},
		webfont: {
			flat: {
				src: 'src/styles/flat/icons/*.svg',
				dest: 'src/styles/flat/font',
				options: {
					font: 'social-likes',
					types: 'woff',
					embed: 'woff',
					template: 'src/styles/flat/webfont.css',
					stylesheet: 'styl',
					hashes: false,
					htmlDemo: false,
					startCodepoint: 0xf101,
				},
			},
		},
		imagemin: {
			options: {
				pngquant: true,
			},
			classic: {
				files: [
					{
						expand: true,
						cwd: 'src/styles/classic/icons_src/',
						src: '*.png',
						dest: 'src/styles/classic/icons/',
					},
				],
			},
			birman: {
				files: [
					{
						expand: true,
						cwd: 'src/styles/birman/icons_src/',
						src: '*.png',
						dest: 'src/styles/birman/icons/',
					},
				],
			},
		},
		watch: {
			options: {
				livereload: true,
			},
			stylus: {
				options: {
					atBegin: true,
				},
				files: 'src/styles/**',
				tasks: ['stylus:compile'],
			},
		},
	});

	grunt.registerTask('default', ['uglify', 'imagemin', 'webfont', 'stylus', 'csso']);
	grunt.registerTask('build', ['uglify', 'imagemin', 'webfont', 'stylus', 'csso']);
};
