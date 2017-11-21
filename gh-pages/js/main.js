/* Author: Artem Sapegin, http://sapegin.me, 2012 */

/*global tamia:false, doT:true, htmlhl:false, store:false */
(function($) {
	'use strict';

	$.extend(doT.templateSettings, {
		strip: false,
		varname: '$',
	});

	var lang = $('html').attr('lang');
	var skins = ['flat', 'classic', 'birman'];
	var skin = 'classic';
	var experimental = location.hash === '#ponies';

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
	function debounce(fn, debounceDuration) {
		// summary:
		//      Returns a debounced function that will make sure the given
		//      function is not triggered too much.
		// fn: Function
		//      Function to debounce.
		// debounceDuration: Number
		//      OPTIONAL. The amount of time in milliseconds for which we
		//      will debounce the function. (defaults to 100ms)

		debounceDuration = debounceDuration || 100;

		return function() {
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
			.replace(/"/g, '&quot;');
	}

	function escapeFormData(data) {
		var fields = ['url', 'title', 'twitter_via', 'twitter_related', 'pinterest_media'];
		for (var fieldIdx = 0; fieldIdx < fields.length; fieldIdx++) {
			var field = fields[fieldIdx];
			data[field] = escapeValue(data[field]);
		}
		return data;
	}

	function fillForm(form, data) {
		jQuery.each(data, function(name, value) {
			var field = form.find('[name="' + name + '"]');
			var type = field.attr('type');
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
			.replace(/\n[\n\t]*\n/g, '\n') // Remove empty lines
			.replace(/ {2,}/g, ' '); // Remove extra spaces
	}

	function highlight(code) {
		return htmlhl(code.replace(/\\\//g, '/'));
	}

	tamia.initComponents({
		builder: function(elem) {
			var form = $(elem);
			var preview = $('.js-preview');
			var code = $('.js-code');
			var twitterExtra = form.find('.js-twitter-extra');
			var pinterestExtra = form.find('.js-pinterest-extra');
			var lightStyle = form.find('.js-light');
			var prepend = doT.template($('#prepend_tmpl').html());
			var template = doT.template($('#build_tmpl').html());
			var previous;

			var delayedUpdate = debounce(function(html, data) {
				// Switch skin
				skin = data.skin;

				$.each(skins, function(i, s) {
					$('#styles_' + s).prop('disabled', s !== skin);
				});

				// Render preview
				preview.attr('class', preview.attr('class').replace(/(preview_)\w+/, '$1' + data.type));
				preview.html(html);
				preview.find('.social-likes').socialLikes();

				form.find('.js-experimental').toggleClass('is-hidden', !experimental);

				store.set(lang, {
					skin: skin,
					type: data.type,
					counters: !!data.counters,
					light: !!data.light,
					title: data.title,
					url: data.url,
					site_facebook: !!data.site_facebook,
					site_mailru: !!data.site_mailru,
					site_odnoklassniki: !!data.site_odnoklassniki,
					site_plusone: !!data.site_plusone,
					site_twitter: !!data.site_twitter,
					site_pinterest: !!data.site_pinterest,
					site_vkontakte: !!data.site_vkontakte,
					twitter_related: data.twitter_related,
					twitter_via: data.twitter_via,
					pinterest_media: data.pinterest_media,
				});
			});

			var loadOptions = function() {
				var data = store.get(lang);
				if (data) {
					fillForm(form, data);
				}
			};

			function update() {
				var dataString = form.serialize();
				if (dataString !== previous) {
					var data = escapeFormData(form.serializeObject());
					data.experimental = experimental;

					twitterExtra.toggleClass('is-hidden', data.site_twitter !== '1');
					pinterestExtra.toggleClass('is-hidden', data.site_pinterest !== '1');
					lightStyle.toggleClass('is-hidden', data.skin !== 'flat');

					var html = cleanHtml(template(data));
					code.html(highlight(prepend(data) + html));
					delayedUpdate(html, data);

					previous = dataString;
				}
			}

			loadOptions();

			form.on('change input', 'input', update);
			update();

			form.submit(function() {
				return false;
			});
		},
	});
})(jQuery);
