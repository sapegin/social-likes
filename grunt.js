/**
How to build this project?

1. Install Grunt:
  npm install grunt -g
  mkdir node_modules
  npm install grunt-stylus

2. Build:
  grunt
*/

/*global module:false*/
module.exports = function(grunt) {
	'use strict';

	// Project configuration
	grunt.initConfig({
		meta: {
			banner: "/*! Author: Artem Sapegin, http://sapegin.me, <%= grunt.template.today('yyyy') %> */"
		},
		lint: {
			files: [
				'grunt.js',
				'js/main.js'
			]
		},
		concat: {
			dist: {
				src: [
					'js/mylibs/htmlhl.js',
					'js/libs/doT.min.js',
					'js/libs/jszip.js',
					'js/libs/jszip-deflate.js',
					'js/libs/store+json2.min.js',
					'js/utils.js',
					'js/main.js'
				],
				dest: 'build/scripts.js'
			}
		},
		min: {
			dist: {
				src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
				dest: 'build/scripts.min.js'
			}
		},
		stylus: {
			compile: {
				files: {
					'build/styles.css': 'styles/index.styl'
				},
				options: {
					'include css': true,
					'paths': ['blocks']
				}
			}
		},
		sweet: {
			content_dir: 'content',
			publish_dir: '.',
			templates_dir: 'templates',
			default_template_id: 'template',
			langs: ['ru', 'en'],
			root_lang: 'en',
			url_prefixes: {
				ru: '/social-likes/ru/',
				en: '/social-likes/'
			},
			uri_prefixes: {
				ru: '/social-likes/ru/',
				en: '/social-likes/'
			},
			files: {
				css: {
					path: 'build/styles.css',
					href: '/social-likes/build/styles.css?{version}'
				},
				js: {
					path: '<config:min.dist.dest>',
					href: '/social-likes/build/scripts.min.js?{version}'
				},
				slcss: {
					path: 'src/social-likes.css',
					href: '/social-likes/src/social-likes.css?{version}'
				},
				sljs: {
					path: 'src/social-likes.js',
					href: '/social-likes/src/social-likes.min.js?{version}'
				}
			}
		},
		watch: {
			stylus: {
				files: 'styles/**',
				tasks: 'stylus'
			},
			concat: {
				files: '<config:concat.dist.src>',
				tasks: 'concat'
			},
			sweet: {
				files: ['content/**', 'templates/**'],
				tasks: 'sweet'
			}
		},
		server: {
			port: 8000,
			base: '.'
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
				undef: true,
				jquery: true
			},
			globals: {
				Modernizr: true,
				jQuery: true
			}
		},
		uglify: {}
	});

	grunt.loadNpmTasks('grunt-stylus');
	grunt.loadNpmTasks('grunt-sweet');

	// Default task
	grunt.registerTask('default', 'stylus lint concat min sweet');
	grunt.registerTask('serve', 'server watch');

};