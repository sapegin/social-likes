module.exports = function(grunt) {
	'use strict';

	grunt.file.expand('../node_modules/grunt-*/tasks').forEach(grunt.loadTasks);

	var debug = !!grunt.option('debug');

	grunt.initConfig({
			pkg: grunt.file.readJSON('../package.json'),
			banner: '/* Author: Artem Sapegin, http://sapegin.me, <%= grunt.template.today("yyyy") %> */\n',
			modernizr: {
				main: {
					devFile: 'vendor/modernizr.js',
					outputFile: '../docs/build/modernizr.js',
					dest: '../docs/build/modernizr.js',
					extra: {
						load: false
					},
					files: {
						src: ['../docs/build/scripts.js', '../docs/build/styles.css']
					}
				}
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
					dest: '../docs/build/scripts.js'
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
							return (require('autoprefixer-stylus'))({browsers: ['last 2 versions', 'ie 9']});
						}, debug || (require('csso-stylus'))
					]
				},
				compile: {
					files: {
						'../docs/build/styles.css': 'styles/index.styl'
					}
				}
			},
			sweet: {
				content_dir: 'content',
				publish_dir: '../docs',
				templates_dir: 'templates',
				default_template_id: 'template',
				langs: ['ru', 'en'],
				root_lang: 'en',
				url_prefixes: {
					ru: '/ru/',
					en: '/'
				},
				uri_prefixes: {
					ru: '/ru/',
					en: '/'
				},
				files: {
					modernizr: {
						path: '../docs/build/modernizr.js',
						href:  '/build/modernizr.js?{version}'
					},
					css: {
						path: '../docs/build/styles.css',
						href: '/build/styles.css?{version}'
					},
					js: {
						path: '<%= concat.main.dest %>',
						href: '/build/scripts.js?{version}'
					},
					sljs: {
						path: '../docs/src/social-likes.min.js',
						href: '/src/social-likes.min.js?{version}'
					},
					slcss_classic: {
						path: '../docs/src/social-likes_classic.css',
						href: '/src/social-likes_classic.css?{version}'
					},
					slcss_flat: {
						path: '../docs/src/social-likes_flat.css',
						href: '/src/social-likes_flat.css?{version}'
					},
					slcss_birman: {
						path: '../docs/src/social-likes_birman.css',
						href: '/src/social-likes_birman.css?{version}'
					}
				}
			},
			replace: {
				version: {
					files: {
						'../docs/index.html': '../docs/index.html',
						'../docs/ru/index.html': '../docs/ru/index.html'
					},
					options: {
						patterns: [
							{
								match: /(<!\-\-VERSION\-\->).*?(<!\-\-\/VERSION\-\->)/g,
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
					files: ['<%= concat.main.dest %>', '../docs/build/styles.css']
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

	return grunt.registerTask('default', ['concat', 'uglify', 'stylus', 'modernizr', 'sweet', 'replace']);
};
