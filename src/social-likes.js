/**
 * Social Likes
 * http://sapegin.github.com/social-likes
 *
 * Sharing buttons for Russian and worldwide social networks.
 *
 * @requires jQuery
 * @author Artem Sapegin
 * @copyright 2012 Artem Sapegin (sapegin.me)
 * @license MIT
 */

/*global define:false, socialLikesButtons:false */

(function (factory) {  // Try to register as an anonymous AMD module
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function ($) { 'use strict';

var prefix = 'social-likes__',
	fadeSpeed = 'fast';


/**
 * Buttons
 */
var services = {
	facebook: {
		counterUrl: 'http://graph.facebook.com/?ids={url}&callback=?',
		convertNumber: function(data) {
			for (var url in data) if (data.hasOwnProperty(url)) {
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
			for (var url in data) if (data.hasOwnProperty(url)) {
				return data[url].shares;
			}
		},
		popupUrl: 'http://connect.mail.ru/share?share_url={url}&title={title}',
		pupupWidth: 550,
		popupHeight: 360
	},
	vkontakte: {
		counterUrl: 'http://vkontakte.ru/share.php?act=count&url={url}&index={index}',
		counter: function(jsonUrl, deferred) {
			var options = services.vkontakte;
			if (!options._) {
				options._ = [];
				if (!window.VK) window.VK = {};
				window.VK.Share = {
					count: function(idx, number) {
						options._[idx].resolve(number);
					}
				};
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
				if (!window.ODKL) window.ODKL = {};
				window.ODKL.updateCount = function(idx, number) {
					options._[idx].resolve(number);
				};
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
				if (balloon.is(':visible')) {
					balloon.fadeOut(fadeSpeed);
					return;
				}
			}
			else {
				balloon = $(template(
					'<div class="' + prefix + 'balloon">' +
						'<div class="' + prefix + 'balloon__arrow"></div>' +
						'{prompt}<br>' +
						'<textarea class="' + prefix + 'balloon__code">{html}</textarea>' +
					'</div>',
					{
						prompt: (this.widget.data('prompt') || 'Copy code to clipboard:'),
						html: this.options.pageHtml
					}
				));
				this.widget.append(balloon);
				this._codeBalloon = balloon;
				balloon.hide();
			}
			balloon.fadeIn(fadeSpeed);
			balloon.find('textarea').select();

			if (balloon.is(':visible')) {
				balloon.removeClass(prefix + 'balloon_right');
				if (balloon.offset().left < 0) {
					balloon.addClass(prefix + 'balloon_right');
				}

				closeOnClick(balloon);
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
				this.widget.append(form);
				this._livejournalForm = form;
			}
			form.submit();
		}
	}
};


/**
 * Counters manager
 */
var counters = {
	promises: {},
	fetch: function(service, url, extraOptions) {
		if (!counters.promises[service]) counters.promises[service] = {};
		var servicePromises = counters.promises[service];

		if (servicePromises[url]) {
			return servicePromises[url];
		}
		else {
			var options = $.extend({}, services[service], extraOptions),
				deferred = $.Deferred(),
				jsonUrl = options.counterUrl && makeUrl(options.counterUrl, {url: url});

			if ($.isFunction(options.counter)) {
				options.counter(jsonUrl, deferred);
			}
			else if (options.counterUrl) {
				$.getJSON(jsonUrl)
					.done(function(data) {
						try {
							var number = data;
							if ($.isFunction(options.convertNumber)) {
								number = options.convertNumber(data);
							}
							deferred.resolve(number);
						}
						catch (e) {
							deferred.reject(e);
						}
					});
			}

			servicePromises[url] = deferred.promise();
			return servicePromises[url];
		}
	}
};


/**
 * jQuery plugin
 */
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
	optionsMap: {
		pageUrl: {
			attr: 'url',
			defaultValue: function() { return window.location.href.replace(window.location.hash, ''); }
		},
		pageTitle: {
			attr: 'title',
			defaultValue: function() { return document.title; }
		},
		pageHtml: {
			attr: 'html',
			defaultValue: function() { return '<a href="' + this.options.pageUrl + '">' + this.options.pageTitle + '</a>'; }
		},
		pageCounters: {
			attr: 'counters',
			defaultValue: 'yes',
			convert: function(value) { return value === 'yes'; }
		}
	},
	init: function() {
		this.readOptions();
		this.single = this.container.hasClass('social-likes_single');

		this.initUserButtons();

		if (this.single) {
			this.makeSingleButton();
			this.container.on('counter.social-likes', $.proxy(this.updateCounter, this));
		}

		var options = this.options;
		this.container.find('li').each(function() {
			new Button($(this), options);
		});
	},
	readOptions: function() {
		this.options = {};
		for (var key in this.optionsMap) {
			var option = this.optionsMap[key];
			this.options[key] = this.container.data(option.attr) ||
				($.isFunction(option.defaultValue) ? $.proxy(option.defaultValue, this)() : option.defaultValue);
			if ($.isFunction(option.convert))
				this.options[key] = option.convert(this.options[key]);
		}
	},
	initUserButtons: function() {
		if (!this.userButtonInited && window.socialLikesButtons) {
			$.extend(services, socialLikesButtons);
		}
		this.userButtonInited = true;
	},
	makeSingleButton: function() {
		var container = this.container;
		container.addClass('social-likes_vertical');
		container.wrap($('<div>', {'class': 'social-likes_single-w'}));
		var wrapper = container.parent();

		var defaultLeft = parseInt(container.css('left'), 10),
			defaultTop = parseInt(container.css('top'), 10);

		container.hide();

		var button = $('<div>', {
			'class': getElementClassNames('button', 'single'),
			'text': container.data('single-title') || 'Share'
		});
		button.prepend($('<span>', {'class': getElementClassNames('icon', 'single')}));
		wrapper.append(button);

		var close = $('<li>', {
			'class': prefix + 'close',
			'html': '&times;'
		});
		container.append(close);

		this.number = 0;

		button.click(function() {
			container.css({ left: defaultLeft,  top: defaultTop });
			showInViewport(container, 20);
			closeOnClick(container);

			return false;
		});
		close.click(function() {
			container.fadeOut(fadeSpeed);
		});

		this.wrapper = wrapper;
	},
	updateCounter: function(e, number) {
		if (!number) return;

		this.number += number;
		this.getCounterElem().text(this.number);
	},
	getCounterElem: function() {
		var counterElem = this.wrapper.find('.' + prefix + 'counter_single');
		if (!counterElem.length) {
			counterElem = $('<span>', {
				'class': getElementClassNames('counter', 'single')
			});
			this.wrapper.append(counterElem);
		}
		return counterElem;
	}
};


function Button(widget, options) {
	this.widget = widget;
	this.options = $.extend({}, options);
	this.detectService();
	if (this.service) {
		this.init();
	}
}

Button.prototype = {
	init: function() {
		this.detectParams();
		this.initHtml();

		if (this.options.pageCounters) {
			if (this.options.counterNumber) {
				this.updateCounter(this.options.counterNumber);
			}
			else {
				var extraOptions = this.options.counterUrl ? { counterUrl: this.options.counterUrl } : {};
				counters.fetch(this.service, this.options.pageUrl, extraOptions)
					.done($.proxy(this.updateCounter, this));
			}
		}
	},

	detectService: function() {
		var classes = this.widget[0].classList || this.widget[0].className.split(' ');
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
		// Custom page counter URL or number
		var counter = this.widget.data('counter');
		if (counter) {
			var number = parseInt(counter, 10);
			if (isNaN(number))
				this.options.counterUrl = counter;
			else
				this.options.counterNumber = number;
		}
	},

	initHtml: function() {
		var options = this.options,
			widget = this.widget;
		var isLink = !!options.clickUrl;

		widget.removeClass(this.service);
		widget.addClass(this.getElementClassNames('widget'));

		// Old initialization HTML
		var a = widget.find('a');
		if (a.length) {
			this.cloneDataAttrs(a, widget);
		}

		// Button
		var button = $(isLink ? '<a>' : '<span>', {
			'class': this.getElementClassNames('button'),
			'text': widget.text()
		});
		if (isLink) {
			var url = makeUrl(options.clickUrl, {
				url: options.pageUrl,
				title: options.pageTitle
			});
			button.attr('href', url);
		}
		else {
			button.click($.proxy(this.click, this));
		}

		// Icon
		button.prepend($('<span>', {'class': this.getElementClassNames('icon')}));

		widget.empty().append(button);
		this.button = button;
	},

	cloneDataAttrs: function(source, destination) {
		var data = source.data();
		for (var key in data) if (data.hasOwnProperty(key)) {
			destination.data(key, data[key]);
		}
	},

	getElementClassNames: function(elem) {
		return getElementClassNames(elem, this.service);
	},

	updateCounter: function(number) {
		number = parseInt(number, 10);
		if (!number) return;

		var counterElem = $('<span>', {
			'class': this.getElementClassNames('counter'),
			'text': number
		});
		this.widget.append(counterElem);

		this.widget.trigger('counter.social-likes', number);
	},

	click: function(e) {
		var options = this.options;
		if ($.isFunction(options.click)) {
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
				value = this.widget.data(key);
			if (value) {
				query[key] = value;
			}
		}

		var glue = (url.indexOf('?') === -1 ? '?' : '&');
		return url + glue + $.param(query);
	},

	openPopup: function(url, params) {
		var left = Math.round(screen.width/2 - params.width/2),
			top = 0;
		if (screen.height > params.height) {
			top = Math.round(screen.height/3 - params.height/2);
		}

		var win = window.open(url, 'sl_' + this.service, 'left=' + left + ',top=' + top + ',' +
			'width=' + params.width + ',height=' + params.height + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1');
		if (win) {
			win.focus();
		} else {
			location.href = url;
		}
	}
};


/**
 * Helpers
 */

function makeUrl(url, context) {
	for (var key in context) if (context.hasOwnProperty(key)) {
		url = url.replace('{' + key + '}', encodeURIComponent(context[key]));
	}
	return url;
}

function template(tmpl, context) {
	for (var key in context) if (context.hasOwnProperty(key)) {
		tmpl = tmpl.replace('{' + key + '}', context[key]);
	}
	return tmpl;
}

function getElementClassNames(elem, mod) {
	var cls = prefix + elem;
	return cls + ' ' + cls + '_' + mod;
}

function closeOnClick(elem) {
	var doc = $(document),
		clickEvent = 'click.social-likes' + Math.random();
	doc.on(clickEvent, function(e) {
		if (!$(e.target).closest(elem).length) {
			elem.fadeOut(fadeSpeed);
			doc.off(clickEvent);
		}
	});
}

function showInViewport(elem, offset) {
	if (document.documentElement.getBoundingClientRect) {
		var left = parseInt(elem.css('left'), 10),
			top = parseInt(elem.css('top'), 10);
		elem.css('visibility', 'hidden').show();

		var rect = elem[0].getBoundingClientRect();
		if (rect.left < offset)
			elem.css('left', offset - rect.left + left);
		else if (rect.right > window.innerWidth - offset)
			elem.css('left', window.innerWidth - rect.right - offset + left);

		if (rect.top < offset)
			elem.css('top', offset - rect.top + top);
		else if (rect.bottom > window.innerHeight - offset)
			elem.css('top', window.innerHeight - rect.bottom - offset + top);

		elem.hide().css('visibility', 'visible');
	}
	elem.fadeIn(fadeSpeed);
}


/**
 * Auto initialization
 */
$(function() {
	$('.social-likes').socialLikes();
});

}));