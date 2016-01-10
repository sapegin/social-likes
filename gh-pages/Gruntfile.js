module.exports = function(grunt) {
	'use strict';

	grunt.file.expand('../node_modules/grunt-*/tasks').forEach(grunt.loadTasks);

	var debug = !!grunt.option('debug');
	var prefix = debug ? '' : '/social-likes/';

	grunt.initConfig({
			pkg: grunt.file.readJSON('../package.json'),
			banner: '/* Author: Artem Sapegin, http://sapegin.me, <%= grunt.template.today("yyyy") %> */\n',
			modernizr: {
				main: {
					devFile: 'vendor/modernizr.js',
					outputFile: 'public/build/modernizr.js',
					dest: 'public/build/modernizr.js',
					extra: {
						load: false
					},
					files: {
						src: ['public/build/scripts.js', 'public/build/styles.css']
					}
				}
			},
			jshint: {
				all: ['js/main.js']
			},
			concat: {
				main: {
					src: [
						'js/mylibs/htmlhl.js',
						'js/libs/doT.min.js',
						'js/libs/jszip.js',
						'js/libs/jszip-deflate.js',
						'js/libs/store+json2.min.js',
						'tamia/vendor/*.js',
						'tamia/tamia/tamia.js',
						'js/main.js'
					],
					dest: 'public/build/scripts.js'
				}
			},
			uglify: {
				main: {
					options: {
						banner: '<%= banner %>',
						compress: {
							global_defs: {
								DEBUG: debug
							}
						}
					},
					files: {
						'<%= concat.main.dest %>': '<%= concat.main.dest %>'
					}
				}
			},
			stylus: {
				options: {
					'include css': true,
					urlfunc: 'embedurl',
					banner: '<%= banner %>',
					define: {
						DEBUG: debug
					},
					paths: ['tamia'],
					use: [
						function() {
							return (require('autoprefixer-stylus'))({browsers: ['last 2 versions', 'ie 8', 'ie 9']});
						}, debug || (require('csso-stylus'))
					]
				},
				compile: {
					files: {
						'public/build/styles.css': 'styles/index.styl'
					}
				}
			},
			sweet: {
				content_dir: 'content',
				publish_dir: 'public',
				templates_dir: 'templates',
				default_template_id: 'template',
				langs: ['ru', 'en'],
				root_lang: 'en',
				url_prefixes: {
					ru: prefix + 'ru/',
					en: prefix
				},
				uri_prefixes: {
					ru: prefix + 'ru/',
					en: prefix
				},
				files: {
					modernizr: {
						path: 'public/build/modernizr.js',
						href: prefix + 'build/modernizr.js?{version}'
					},
					css: {
						path: 'public/build/styles.css',
						href: prefix + 'build/styles.css?{version}'
					},
					js: {
						path: '<%= concat.main.dest %>',
						href: prefix + 'build/scripts.js?{version}'
					},
					sljs: {
						path: 'public/src/social-likes.min.js',
						href: prefix + 'src/social-likes.min.js?{version}'
					},
					slcss_classic: {
						path: 'public/src/social-likes_classic.css',
						href: prefix + 'src/social-likes_classic.css?{version}'
					},
					slcss_flat: {
						path: 'public/src/social-likes_flat.css',
						href: prefix + 'src/social-likes_flat.css?{version}'
					},
					slcss_birman: {
						path: 'public/src/social-likes_birman.css',
						href: prefix + 'src/social-likes_birman.css?{version}'
					}
				}
			},
			replace: {
				version: {
					files: {
						'public/index.html': 'public/index.html',
						'public/ru/index.html': 'public/ru/index.html'
					},
					options: {
						patterns: [
							{
								match: /(<!\-\-VERSION\-\->).*?(<!\-\-\/VERSION\-\->)/,
								replacement: '$1<%= pkg.version %>$2'
							}
						]
					}
				}
			},
			connect: {
				server: {
					options: {
						port: 9000,
						base: '.'
					}
				}
			},
			watch: {
				livereload: {
					options: {
						livereload: true
					},
					files: ['<%= concat.main.dest %>', 'public/build/styles.css']
				},
				concat: {
					options: {
						atBegin: true
					},
					files: '<%= concat.main.src %>',
					tasks: 'concat'
				},
				stylus: {
					options: {
						atBegin: true
					},
					files: 'styles/**',
					tasks: 'stylus'
				},
				sweet: {
					options: {
						atBegin: true
					},
					files: ['content/**', 'templates/**'],
					tasks: 'sweet'
				}
			}
		}
	);

	return grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'stylus', 'modernizr', 'sweet', 'replace']);
};
