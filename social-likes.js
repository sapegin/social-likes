/**
 * Social Likes
 * http://sapegin.github.com/social-likes
 *
 * Sharing buttons for Russian and worldwide social networks.
 *
 * @version 1.2.2
 * @requires jQuery 1.6
 * @author Artem Sapegin
 * @copyright 2011 Artem Sapegin (sapegin.ru)
 * @license MIT
 */
 
(function($){

	var socialLikes = function() {
		this.init();
	};

	socialLikes.prototype = {
		init: function() {
			this.counters = {};

			var containers = $('.social-likes');

			// Dirty hack for G+ button but I cannot find a better solution yet
			if ($.browser.msie && $.browser.version <= 9) {
				containers.addClass('social-likes-msie-lte9');
			}

			containers.each($.proxy(this.initWidget, this));
		},

		initWidget: function(idx, container) {
			$(container).find('li').each($.proxy(this.findButtons, this));
		},

		findButtons: function(idx, li) {
			var buttonWrapper = $(li),
				container = buttonWrapper.closest('.social-likes'),
				pageUrl = this.getPageUrl(container),
				escapedPageUrl = escape(pageUrl);
			
			if (!this.counters[pageUrl]) this.counters[pageUrl] = {};
			var counters = this.counters[pageUrl];

			var classes = buttonWrapper[0].className.split(' ');
			for (var classIdx = 0; classIdx < classes.length; classIdx++) {
				var cls = classes[classIdx];
				switch(cls) {
					case 'twitter':
						this.loadCount(cls, 'http://urls.api.twitter.com/1/urls/count.json?callback=?',
							{url: pageUrl}, pageUrl, buttonWrapper, function(data) { return data.count; });

						this.initButton({
							url: pageUrl,
							urlParam: 'url',
							textParam: 'text',
							additionalParams: ['via', 'related'],
							popupUrl: 'http://twitter.com/share',
							pupupWidth: 550,
							popupHeight: 450
						}, buttonWrapper, cls);

						break;

					case 'facebook':
						this.loadCount(cls, 'https://api.facebook.com/method/fql.query?query=select total_count from link_stat where url="' +
							escapedPageUrl + '"&format=json&callback=?',
							{}, pageUrl, buttonWrapper, function(data) { return data[0] && data[0].total_count; });

						this.initButton({
							url: pageUrl,
							urlParam: 'u',
							textParam: 't',
							popupUrl: 'http://www.facebook.com/sharer.php',
							pupupWidth: 550,
							popupHeight: 450
						}, buttonWrapper, cls);

						break;
						
					case 'plusone':
						this.initButton({
							url: pageUrl,
							urlParam: 'url',
							popupUrl: 'https://plusone.google.com/_/+1/confirm?hl=ru_RU',
							pupupWidth: 500,
							popupHeight: 300
						}, buttonWrapper, cls);

						break;

					case 'mailru':
						this.loadCount(cls, 'http://connect.mail.ru/share_count?func=?', {
								url_list: pageUrl,
								callback: 1,
							}, pageUrl, buttonWrapper, function(data) { return data[pageUrl] && data[pageUrl].shares; });						

						this.initButton({
							url: pageUrl,
							urlParam: 'share_url',
							popupUrl: 'http://connect.mail.ru/share',
							pupupWidth: 550,
							popupHeight: 360
						}, buttonWrapper, cls);

						break;
 
					case 'vkontakte':
						if (!this._vkontakte) {
							this._vkontakte = [];
							window.VK = {Share: {count: $.proxy(function(idx, count) {
								this.updateCount(this._vkontakte[idx], count);
							}, this)}};
						}
						var index = this._vkontakte.length;
						this._vkontakte[index] = buttonWrapper;
						this.loadCount(cls, null, null, pageUrl, buttonWrapper, null, function() {
								$.ajax({
									url: 'http://vkontakte.ru/share.php?act=count&index=' + index + '&url=' + escapedPageUrl,
									dataType: 'jsonp'
								});
							});	

						this.initButton({
							url: pageUrl,
							urlParam: 'url',
							textParam: 'title',
							popupUrl: 'http://vkontakte.ru/share.php',
							pupupWidth: 550,
							popupHeight: 330
						}, buttonWrapper, cls);

						break;
						
					case 'odnoklassniki':
						if (!this._odnoklassniki) {
							this._odnoklassniki = [];
							window.ODKL = {updateCount: $.proxy(function(idx, count) {
								this.updateCount(this._odnoklassniki[idx], count);
							}, this)};
						}
						var index = this._odnoklassniki.length;
						this._odnoklassniki[index] = buttonWrapper;
						this.loadCount(cls, null, null, pageUrl, buttonWrapper, null, function() {
								$.ajax({
									url: 'http://www.odnoklassniki.ru/dk?st.cmd=extLike&uid=' + index + '&ref=' + escapedPageUrl,
									dataType: 'jsonp'
								});
							});
						
						this.initButton({
							url: pageUrl,
							urlParam: 'st._surl',
							popupUrl: 'http://www.odnoklassniki.ru/dk?st.cmd=addShare',
							pupupWidth: 550,
							popupHeight: 360
						}, buttonWrapper, cls);

						break;

					case 'livejournal':
						var button = buttonWrapper.find(':submit');
						var newLink = $('<a href="#">' + button.val() + '</a>');
						newLink.click(function(){ $(this).closest('form').submit(); });
						if (button.attr('title')) {
							newLink.attr('title', button.attr('title'));
						}
						button.hide();
						button.after(newLink);
						break;

					case 'code':
						var link = buttonWrapper.find('a');
						link.click($.proxy(function(){
							var balloon = buttonWrapper.find('.social-balloon');
							if (balloon.length) {
								balloon.toggle();
							}
							else {
								balloon = $([
									'<div class="social-balloon">',
										'<i></i>',
										'Скопируйте код в&nbsp;буфер обмена:<br>',
										'<textarea class="social-code-area"></textarea>',
									'</div>'
								].join(''));
								link.after(balloon);
								var textarea = buttonWrapper.find('textarea');
								var messageField = container.find('.livejournal input[name="event"]');
								if (!messageField.length) messageField = container.find('.code input[name="event"]');
								textarea.val(messageField.val());
								this.selectTextInTextarea(textarea);
							}
							
							if (balloon.is(":visible")) {
								$(document).bind('click.social-hide-code', function(e){
									if (!$(e.target).hasClass('social-code-area')) {
										balloon.hide();
										$(document).unbind('click.social-hide-code');
									}
									return true;
								});
							}

							return false;
						}, this));

						break;
				}

				// Icon container
				buttonWrapper.find('a').prepend('<i></i>');
			}
		},

		initButton: function(params, buttonWrapper, buttonName) {
			var link = buttonWrapper.find('a');

			var query = {};
			if (params.urlParam)
				query[params.urlParam] = params.url;
			if (params.textParam)
				query[params.textParam] = document.title;
			if (params.additionalParams) {
				for (var paramIdx = 0; paramIdx < params.additionalParams.length; paramIdx++) {
					var key = params.additionalParams[paramIdx];
					if (link.data(key))
						query[key] = link.data(key);
				}
			}

			var this_ = this;
			link.click(function(){
				var paramsSeparator = params.popupUrl.indexOf('?') === -1 ? '?' : '&';
				this_.openWindow(params.popupUrl + paramsSeparator + this_.getQuery(query), {
					width: params.pupupWidth,
					height: params.popupHeight,
					name: 'share_' + buttonName
				});
				return false;
			});
		},

		loadCount: function(id, url, params, pageUrl, buttonWrapper, getNumber, request) {
			if (!this.counters[pageUrl]) this.counters[pageUrl] = {};
			var counters = this.counters[pageUrl];
			
			if (counters[id] === undefined) {
				if (request) {
					request();
				}
				else {
					$.getJSON(url, params, $.proxy(function(data){
							var number = getNumber(data);
							this.updateCount(buttonWrapper, number);
							counters[id] = number;
						}, this));
				}
				counters[id] = true;
			}
			else if (counters[id] !== true) {
				this.updateCount(buttonWrapper, counters[id]);
			}
		},

		updateCount: function(buttonWrapper, count) {
			count = parseInt(count, 10);
			var counter = buttonWrapper.find('b i i');
			if (counter.length) {
				counter.html(count);
			}
			else {
				if (count) {
					buttonWrapper.append('<b><i><i></i></i>' + count + '</b>');
				}
			}
		},

		openWindow: function(url, params) {
			var left = Math.round((screen.width / 2) - (params.width / 2));
			var top = 0;
			if (screen.height > params.height) {
				top = Math.round((screen.height / 3) - (params.height / 2));
			}
			var win = window.open(url, params.name, "left=" + left + ",top=" + top + ",width=" + params.width + ",height=" + params.height + ",personalbar=0,toolbar=0,scrollbars=1,resizable=1");
			if (win) {
				win.focus();
			} else {
				window.location.href = url;
			}
		},

		getPageUrl: function(buttonWrapper) {
			return buttonWrapper.data('url') || window.location.href.replace(window.location.hash, '');
		},

		getQuery: function(params) {
			var query = [];
			for (var key in params) {
				query.push(key + '=' + encodeURIComponent(params[key]).replace(/\+/g, '%2B'));
			}
			return query.join('&');
		},

		selectTextInTextarea: function(elem) {
			this.selectTextRange(elem, 0, elem.val().length);
		},

		selectTextRange: function(elem, start, end) {
			elem = elem[0];
			if (elem.setSelectionRange) {
				elem.focus();
				elem.setSelectionRange(start, end);
			}
			else if (elem.createTextRange) {
				var range = elem.createTextRange();
				range.collapse(true);
				range.moveEnd('character', end);
				range.moveStart('character', start);
				range.select();
			}
		}
	};

	if (document.body) {
		new socialLikes();
	}
	else {
		$(function() { new socialLikes(); });
	}

})(jQuery);