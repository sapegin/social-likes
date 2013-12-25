# gruntjs.com

module.exports = (grunt) ->
	'use strict'

	require('load-grunt-tasks')(grunt)

	debug = !!grunt.option('debug')
	prefix = if debug then '' else '/social-likes/'

	grunt.initConfig
		modernizr:
			devFile: 'bower_components/modernizr/modernizr.js'
			outputFile: 'build/modernizr.js'
			extra:
				load: false
			files: [
				'build/scripts.js'
				'build/styles.css'
			]
		banner: '/* Author: Artem Sapegin, http://sapegin.me, <%= grunt.template.today("yyyy") %> */\n'
		jshint:
			all: [
				'js/main.js'
			]
		concat:
			main:
				src: [
					'bower_components/jquery/jquery.js'
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
					path: 'src/social-likes.css'
					href: prefix + 'src/social-likes.css?{version}'
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

	grunt.registerTask 'default', ['jshint', 'concat', 'uglify', 'stylus', 'modernizr', 'sweet']
	# grunt.registerTask 'deploy', ['stylus', 'bower_concat', 'coffee', 'concat', 'uglify', 'modernizr']
