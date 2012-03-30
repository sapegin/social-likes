/**
 * Social Likes
 * http://sapegin.github.com/social-likes
 *
 * Sharing buttons for Russian and worldwide social networks.
 *
 * @version 2.0.0 alpha
 * @requires jQuery 1.7
 * @author Artem Sapegin
 * @copyright 2012 Artem Sapegin (sapegin.me)
 * @license MIT
 */

(function (factory) {  // Try to register as an anonymous AMD module
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function ($) {

var services = {
	facebook: {
		counterUrl: 'http://graph.facebook.com/?ids={url}&callback=?',
		convertNumber: function(data) {
			for (var url in data) {
				return data[url].shares;
			}
		},
		popupUrl: 'http://www.facebook.com/sharer/sharer.php?u={url}',
		pupupWidth: 600,
		popupHeight: 500
	},
	twitter: {
		counterUrl: 'http://urls.api.twitter.com/1/urls/count.json?url={url}&callback=?',
		convertNumber: function(data) {
			return data.count;
		},
		popupUrl: 'http://twitter.com/intent/tweet?url={url}&text={title}',
		pupupWidth: 600,
		popupHeight: 450,
		additionalParams: ['via', 'related']
	},
	mailru: {
		counterUrl: 'http://connect.mail.ru/share_count?url_list={url}&callback=1&func=?',
		convertNumber: function(data) {
			for (var url in data) {
				return data[url].shares;
			}
		},
		popupUrl: 'http://connect.mail.ru/share?share_url={url}',
		pupupWidth: 550,
		popupHeight: 360
	},
	vkontakte: {
		counterUrl: 'http://vkontakte.ru/share.php?act=count&url={url}&index={index}',
		counter: function(jsonUrl, deferred) {
			var options = services.vkontakte;
			if (!options._) {
				options._ = [];
				window.VK = {Share: {count: function(idx, number) {
					options._[idx].resolve(number);
				}}};
			}

			var index = options._.length;
			options._.push(deferred);
			$.ajax({
				url: makeUrl(jsonUrl, {index: index}),
				dataType: 'jsonp'
			});
		},
		popupUrl: 'http://vk.com/share.php?url={url}&title={title}',
		pupupWidth: 550,
		popupHeight: 330
	},
	odnoklassniki: {
		counterUrl: 'http://www.odnoklassniki.ru/dk?st.cmd=extLike&ref={url}&uid={index}',
		counter: function(jsonUrl, deferred) {
			var options = services.odnoklassniki;
			if (!options._) {
				options._ = [];
				window.ODKL = {updateCount: function(idx, number) {
					options._[idx].resolve(number);
				}};
			}

			var index = options._.length;
			options._.push(deferred);
			$.ajax({
				url: makeUrl(jsonUrl, {index: index}),
				dataType: 'jsonp'
			});
		},
		popupUrl: 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st._surl={url}',
		pupupWidth: 550,
		popupHeight: 360
	},
	plusone: {
		popupUrl: 'https://plus.google.com/share?url={url}',
		pupupWidth: 700,
		popupHeight: 500
	},
	code: {
		click: function(e) {
			var balloon = this._codeBalloon;
			if (balloon) {
				balloon.toggle();
			}
			else {
				balloon = $(template(
					'<div class="social-likes__balloon">' +
						'<div class="social-likes__balloon__arrow"></div>' +
						'{prompt}<br>' +
						'<textarea class="social-likes__balloon__code">{html}</textarea>' +
					'</div>',
					{
						prompt: (this.button.data('prompt') || 'Copy code to clipboard:'),
						html: this.options.pageHtml
					}
				));
				this.button.after(balloon);
				this._codeBalloon = balloon;
			}

			balloon.find('textarea').select();

			if (balloon.is(':visible')) {
				var doc = $(document),
					clickEvent = 'click.social-likes__hide-code';
				doc.on(clickEvent, function(e) {
					if (e.target.tagName !== 'TEXTAREA') {
						balloon.hide();
						doc.off(clickEvent);
					}
				});
			}
		}
	},
	livejournal: {
		click: function(e) {
			var form = this._livejournalForm;
			if (!form) {
				var html = this.options.pageHtml
					.replace(/&/g, '&amp;')
					.replace(/"/g, '&quot;');
				form = $(template(
					'<form action="http://www.livejournal.com/update.bml" method="post" target="_blank">' +
						'<input type="hidden" name="mode" value="full">' +
						'<input type="hidden" name="subject" value="{title}">' +
						'<input type="hidden" name="event" value="{html}">' +
					'</form>',
					{
						title: this.options.pageTitle,
						html: html
					}
				));
				this.button.append(form);
				this._livejournalForm = form;
			}
			form.submit();
		}
	}
};


var counters = {
	promises: {},
	fetch: function(service, url) {
		if (!counters.promises[service]) counters.promises[service] = {};
		var servicePromises = counters.promises[service];

		if (servicePromises[url]) {
			return servicePromises[url];
		}
		else {
			var options = services[service],
				deferred = $.Deferred(),
				jsonUrl = options.counterUrl && makeUrl(options.counterUrl, {url: url});

			if (typeof options.counter === 'function') {
				options.counter(jsonUrl, deferred);
			}
			else if (options.counterUrl) {
				$.getJSON(jsonUrl)
					.done(function(data) {
						try {
							var number = data;
							if (typeof options.convertNumber === 'function') {
								number = options.convertNumber(data);
							}
							deferred.resolve(number);
						}
						catch (e) {
							throw e;
							deferred.reject(e);
						}
					});
			}

			servicePromises[url] = deferred.promise();
			return servicePromises[url];
		}
	}
};


$.fn.socialLikes = function() {
	return this.each(function() {
		new SocialLikes($(this));
	});
};


function SocialLikes(container) {
	this.container = container;
	this.init();
}

SocialLikes.prototype = {
	init: function() {
		var options = {
			pageUrl: this.pageUrl(),
			pageTitle: this.pageTitle(),
			pageHtml: this.pageHtml()
		};
		this.container.find('li').each(function() {
			new Button($(this), options);
		});
	},
	pageUrl: function() {
		return 'http://mail.ru';
		//return this.container.data('url') || window.location.href.replace(window.location.hash, '');
	},
	pageTitle: function() {
		return this.container.data('title') || document.title;
	},
	pageHtml: function() {
		return (this.container.data('html') ||
			'<a href="' + this.pageUrl() + '">' + this.pageTitle() + '</a>');
	}
};


function Button(button, options) {
	this.button = button;
	this.options = $.extend({}, options);
	this.detectService();
	if (this.service) {
		this.init();
	}
}

Button.prototype = {
	prefix: 'social-likes__',

	init: function() {
		this.detectParams();
		this.initHtml();
		this.setEventHandlers();
		counters.fetch(this.service, this.options.pageUrl)
			.done($.proxy(this.updateCounter, this));
	},

	detectService: function() {
		var classes = this.button[0].classList || this.button[0].className.split(' ');
		for (var classIdx = 0; classIdx < classes.length; classIdx++) {
			var cls = classes[classIdx];
			if (services[cls]) {
				this.service = cls;
				$.extend(this.options, services[cls]);
				return;
			}
		}
	},

	detectParams: function() {
		// Custom page counter URL
		var counterUrl = this.button.data('counter-url');
		if (counterUrl) {
			this.options.counterUrl = counterUrl;
		}
	},

	initHtml: function() {
		var button = this.button;

		button.removeClass(this.service);
		button.addClass(this.getElementClassNames('button'));

		// Icon
		button.prepend($('<span>', {'class': this.getElementClassNames('icon')}));
	},

	getElementClassNames: function(elem) {
		var cls = this.prefix + elem;
		return cls + ' ' + cls + '_' + this.service;
	},

	setEventHandlers: function() {
		this.button.click($.proxy(this.click, this));
	},

	updateCounter: function(number) {
		number = parseInt(number, 10);
		if (!number) return;

		var counterElem = $('<span>', {
			'class': this.getElementClassNames('counter'),
			'html': number
		});
		this.button.append(counterElem);
	},

	click: function(e) {
		var options = this.options;
		if (typeof options.click === 'function') {
			options.click.call(this, e);
		}
		else {
			var url = makeUrl(options.popupUrl, {
				url: options.pageUrl,
				title: options.pageTitle
			});
			url = this.addAdditionalParamsToUrl(url);
			this.openPopup(url, {
				width: options.pupupWidth,
				height: options.popupHeight
			});
		}
		return false;
	},

	addAdditionalParamsToUrl: function(url) {
		var params = this.options.additionalParams;
		if (!params) return url;

		var query = {};
		for (var paramIdx = 0; paramIdx < params.length; paramIdx++) {
			var key = params[paramIdx],
				value = this.button.data(key);
			if (value) {
				query[key] = value;
			}
		}

		var glue = (url.indexOf('?') === -1 ? '?' : '&');
		return url + glue + $.param(query);
	},

	openPopup: function(url, params) {
		var left = Math.round(screen.width/2 - params.width/2);
			top = 0;
		if (screen.height > params.height) {
			top = Math.round(screen.height/3 - params.height/2);
		}

		var win = window.open(url, this.prefix + this.service, 'left=' + left + ',top=' + top + ',' +
			'width=' + params.width + ',height=' + params.height + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1');
		if (win) {
			win.focus();
		} else {
			location.href = url;
		}
	}
};


// Helpers

function makeUrl(url, context) {
	for (var key in context) {
		url = url.replace('{' + key + '}', encodeURIComponent(context[key]).replace(/\+/g, '%2B'));
	}
	return url;
};

function template(tmpl, context) {
	for (var key in context) {
		tmpl = tmpl.replace('{' + key + '}', context[key]);
	}
	return tmpl;
};


// Auto initialization
$(function() {
	$('.social-likes').socialLikes();
});

}));