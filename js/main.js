/* Author: Artem Sapegin, http://sapegin.me, 2012 */

/*jshint browser:true, jquery:true, white:false, smarttabs:true, eqeqeq:true,
         immed:true, latedef:true, newcap:true, undef:true */
/*global utils:false, doT:true, htmlhl:false, JSZip:false, store:false */
;(function ($) {
	'use strict';

	$.extend(doT.templateSettings, {
		strip: false,
		varname: '$'
	});

	var lang = $('html').attr('lang'),
		downloadData = {
			lang: lang,
			jquery_ver: jQuery.fn.jquery,
			footer: $('#index_footer_tmpl').text(),
			html: ''
		},
		filesUrls = {
			'social-likes.min.js': '/social-likes/src/social-likes.min.js',
			'social-likes.css': '/social-likes/src/social-likes.css'
		},
		files = null,
		templateIndex = doT.template($('#index_tmpl').text().replace(/\\\//g, '/')),
		experimental = location.hash === '#ponies',
		simple = $.browser.msie;

	// stackoverflow.com/questions/1184624/convert-form-data-to-js-object-with-jquery
	$.fn.serializeObject = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};


	// jasonwyatt.tumblr.com/post/10481498815/how-to-correctly-debounce-a-javascript-function
	function debounce(fn, debounceDuration){
		// summary:
		//      Returns a debounced function that will make sure the given
		//      function is not triggered too much.
		// fn: Function
		//      Function to debounce.
		// debounceDuration: Number
		//      OPTIONAL. The amount of time in milliseconds for which we
		//      will debounce the function. (defaults to 100ms)

		debounceDuration = debounceDuration || 100;

		return function(){
			if (!fn.debouncing) {
				fn.debouncing = true;
			}
			clearTimeout(fn.debounceTimeout);
			var args = Array.prototype.slice.apply(arguments);
			fn.debounceTimeout = setTimeout(function() {
				fn.lastReturnVal = fn.apply(window, args);
				fn.debouncing = false;
			}, debounceDuration);

			return fn.lastReturnVal;
		};
	}

	function escapeValue(value) {
		return value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
		;
	}

	function escapeFormData(data) {
		var fields = ['url', 'title', 'twitter_via', 'twitter_related'];
		for (var fieldIdx = 0; fieldIdx < fields.length; fieldIdx++) {
			var field = fields[fieldIdx];
			data[field] = escapeValue(data[field]);
		}
		return data;
	}

	function fillForm(form, data) {
		jQuery.each(data, function(name, value) {
			var field = form.find('[name="' + name + '"]'),
				type = field.attr('type');
			switch (type) {
				case 'checkbox':
					field.prop('checked', !!value);
					break;
				case 'radio':
					field.filter('[value="' + value + '"]').prop('checked', true);
					break;
				default:
					field.val(value);
					break;
			}
		});
	}

	function cleanHtml(code) {
		return code
			.replace(/\n[\n\t]*\n/g, '\n')  // Remove empty lines
			.replace(/ {2,}/g, ' ')  // Remove extra spaces
		;
	}

	function highlight(code) {
		return htmlhl(code.replace(/\\\//g, '/'));
	}

	function download(e) {
		if (!files) {
			getFiles();
		}

		var zip = new JSZip();
		zip.file('index.html', templateIndex(downloadData));

		for (var fileName in files) {
			zip.file(fileName, files[fileName]);
		}

		var content = zip.generate();

		$(e.target).attr('href', 'data:application/zip;base64,' + content);
	}

	function getFiles() {
		files = {};
		for (var fileName in filesUrls) {
			getFile(fileName);
		}
	}

	function getFile(fileName) {
		$.ajax(filesUrls[fileName], { async: false, dataType: 'html' }).then(function(data) {
			files[fileName] = data;
		});
	}

	utils.initComponents({
		builder: function(elem) {
			var form = $(elem),
				preview = $('#preview'),
				code = $('#code'),
				twitterExtra = form.find('.js-twitter-extra'),
				prepend = $('#prepend_tmpl').text(),
				template = doT.template($('#build_tmpl').text()),
				previous;

			var delayedUpdate = debounce(function(html, data) {
				preview.html(html);
				preview.find('.social-likes').socialLikes();

				store.set(lang, {
					type: data.type,
					counters: data.counters,
					title: data.title,
					url: data.url,
					site_facebook: !!data.site_facebook,
					site_mailru: !!data.site_mailru,
					site_odnoklassniki: !!data.site_odnoklassniki,
					site_plusone: !!data.site_plusone,
					site_twitter: !!data.site_twitter,
					site_vkontakte: !!data.site_vkontakte,
					site_livejournal: !!data.site_livejournal,
					site_code: !!data.site_code,
					twitter_related: data.twitter_related,
					twitter_via: data.twitter_via
				});
			});

			var loadOptions = function() {
				var data = store.get(lang);
				if (data) fillForm(form, data);
			};

			function update() {
				var dataString = form.serialize();
				if (dataString !== previous) {
					var data = escapeFormData(form.serializeObject());
					data.experimental = experimental;

					twitterExtra.toggle(data.site_twitter === '1', 200);

					var html = cleanHtml(template(data));
					code.html(highlight(prepend + html));
					delayedUpdate(html, data);
					downloadData.html = html;

					previous = dataString;
				}
			}

			loadOptions();

			form.on('change input', 'input', update);
			update();

			form.submit(function() {
				return false;
			});

			if (simple) {
				$('body').addClass('is-simple');
			}
			else {
				$('.js-download').click(download);
			}
		}
	});

}(jQuery));
