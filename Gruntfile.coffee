# gruntjs.com

module.exports = (grunt) ->
	'use strict'

	require('load-grunt-tasks')(grunt)

	debug = !!grunt.option('debug')
	prefix = if debug then '' else '/social-likes/'

	grunt.initConfig
		bwr: grunt.file.readJSON('src/bower.json')
		banner: '/* Author: Artem Sapegin, http://sapegin.me, <%= grunt.template.today("yyyy") %> */\n'
		modernizr:
			devFile: 'bower_components/modernizr/modernizr.js'
			outputFile: 'build/modernizr.js'
			extra:
				load: false
			files: [
				'build/scripts.js'
				'build/styles.css'
			]
		jshint:
			all: [
				'js/main.js'
			]
		concat:
			main:
				src: [
					'js/mylibs/htmlhl.js'
					'js/libs/doT.min.js'
					'js/libs/jszip.js'
					'js/libs/jszip-deflate.js'
					'js/libs/store+json2.min.js'
					'tamia/vendor/*.js'
					'tamia/tamia/tamia.js'
					'js/main.js'
				]
				dest: 'build/scripts.js'
		uglify:
			main:
				options:
					banner: '<%= banner %>'
					compress:
						global_defs:
							DEBUG: debug
				files:
					'<%= concat.main.dest %>': '<%= concat.main.dest %>'
		stylus:
			options:
				'include css': true
				urlfunc: 'embedurl'
				banner: '<%= banner %>'
				define:
					DEBUG: debug
					import_tree: (require 'stylus-import-tree')
				paths: [
					'tamia'
				]
				use: [
					() -> (require 'autoprefixer-stylus')('last 2 versions', 'ie 8', 'ie 9')
					debug or (require 'csso-stylus')
				]
			compile:
				files:
					'build/styles.css': 'styles/index.styl'
		sweet:
			content_dir: 'content'
			publish_dir: '.'
			templates_dir: 'templates'
			default_template_id: 'template'
			langs: ['ru', 'en']
			root_lang: 'en'
			url_prefixes:
				ru: prefix + 'ru/'
				en: prefix
			uri_prefixes:
				ru: prefix + 'ru/'
				en: prefix
			files:
				modernizr:
					path: 'build/modernizr.js'
					href: prefix + 'build/modernizr.js?{version}'
				css:
					path: 'build/styles.css'
					href: prefix + 'build/styles.css?{version}'
				js:
					path: '<%= concat.main.dest %>'
					href: prefix + 'build/scripts.js?{version}'
				sljs:
					path: 'src/social-likes.min.js'
					href: prefix + 'src/social-likes.min.js?{version}'
				slcss_classic:
					path: 'src/social-likes_classic.css'
					href: prefix + 'src/social-likes_classic.css?{version}'
				slcss_flat:
					path: 'src/social-likes_flat.css'
					href: prefix + 'src/social-likes_flat.css?{version}'
				slcss_birman:
					path: 'src/social-likes_birman.css'
					href: prefix + 'src/social-likes_birman.css?{version}'
		replace:
			version:
				files:
					'index.html': 'index.html'
					'ru/index.html': 'ru/index.html'
				options:
					patterns: [
						match: /(<!\-\-VERSION\-\->).*?(<!\-\-\/VERSION\-\->)/
						replacement: '$1<%= bwr.version %>$2'
					]
		connect:
			server:
				options:
					port: 9000
					base: '.'
		watch:
			livereload:
				options:
					livereload: true
				files: [
					'<%= concat.main.dest %>'
					'build/styles.css'
				]
			concat:
				options:
					atBegin: true
				files: '<%= concat.main.src %>'
				tasks: 'concat'
			stylus:
				options:
					atBegin: true
				files: 'styles/**'
				tasks: 'stylus'
			sweet:
				options:
					atBegin: true
				files: ['content/**', 'templates/**']
				tasks: 'sweet'

	grunt.registerTask 'default', ['jshint', 'concat', 'uglify', 'stylus', 'modernizr', 'sweet', 'replace']
