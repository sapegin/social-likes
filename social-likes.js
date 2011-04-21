/**
 * Social Likes
 *
 * Sharing buttons for Russian and worldwide social networks.
 *
 * @version 1.1
 * @requires jQuery 1.4
 * @author Artem Sapegin
 * @copyright 2011 Artem Sapegin (sapegin.ru)
 * @license http://creativecommons.org/licenses/by/3.0/
 */
 
(function($){

	var socialLikes = function(){
		this.init();
	};

	socialLikes.prototype = {
		init: function() {
			this.pageUrl = window.location.href;
			this.container = $('.social-likes');
			var this_ = this;
			this.counters = {};

			this.container.find('li').each(function(){
				var buttonWrapper = $(this);
				var classes = buttonWrapper[0].className.split(' ');
				for (var classIdx = 0; classIdx < classes.length; classIdx++) {
					var cls = classes[classIdx];
					switch(cls) {
						case 'twitter':
							if (!this_.counters.twiter) {
								$.getJSON('http://urls.api.twitter.com/1/urls/count.json?url=' + escape(this_.pageUrl) + '&callback=?', function(data){ this_.updateCount(cls, data.count); });
								this_.counters.twiter = true;
							}

							this_.initButton({
								urlParam: 'url',
								textParam: 'text',
								additionalParams: ['via', 'related'],
								popupUrl: 'http://twitter.com/share',
								pupupWidth: 550,
								popupHeight: 450
							}, buttonWrapper, cls);

							break;

						case 'facebook':
							if (!this_.counters.facebook) {
								$.getJSON('https://api.facebook.com/method/fql.query?query=select total_count from link_stat where url="' + escape(this_.pageUrl) + '"&format=json&callback=?', function(data){ this_.updateCount(cls, data[0].total_count); });
								this_.counters.facebook = true;
							}

							this_.initButton({
								urlParam: 'u',
								textParam: 't',
								popupUrl: 'http://www.facebook.com/sharer.php',
								pupupWidth: 550,
								popupHeight: 450
							}, buttonWrapper, cls);

							break;

						case 'mailru':
							if (!this_.counters.mailru) {
								$.getJSON('http://connect.mail.ru/share_count?url_list=' + escape(this_.pageUrl) + '&callback=1&func=?', function(data){ this_.updateCount(cls, data[this_.pageUrl] && data[this_.pageUrl].shares); });
								this_.counters.mailru = true;
							}

							this_.initButton({
								urlParam: 'share_url',
								popupUrl: 'http://connect.mail.ru/share',
								pupupWidth: 550,
								popupHeight: 360
							}, buttonWrapper, cls);

							break;

						case 'vkontakte':
							if (!this_.counters.vkontakte) {
								window.VK = {Share: {count: function(junk, count) {
									this_.updateCount(cls, count);
								}}};
								$.ajax({
									url: 'http://vkontakte.ru/share.php?act=count&index=1&url=' + escape(this_.pageUrl),
									dataType: 'jsonp'
								});
								this_.counters.vkontakte = true;
							}

							this_.initButton({
								urlParam: 'url',
								textParam: 'title',
								popupUrl: 'http://vkontakte.ru/share.php',
								pupupWidth: 550,
								popupHeight: 330
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
							link.click(function(){
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
									var messageField = this_.container.find('.livejournal input[name="event"]');
									if (!messageField.length) messageField = this_.container.find('.code input[name="event"]');
									textarea.val(messageField.val());
									this_.selectTextInTextarea(textarea);
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
							});							

							break;
					}

					// Icon container
					buttonWrapper.find('a').prepend('<i></i>');
				}
			});
		},

		initButton: function(params, buttonWrapper, buttonName) {
			var link = buttonWrapper.find('a');

			var query = {};
			if (params.urlParam)
				query[params.urlParam] = this.pageUrl;
			if (params.textParam)
				query[params.textParam] = document.title;
			if (params.additionalParams) {
				for (var paramIdx = 0; paramIdx < params.additionalParams.length; paramIdx++) {
					var key = params.additionalParams[paramIdx];
					if (link.attr('data-' + key))
						query[key] = link.attr('data-' + key);
				}
			}

			var this_ = this;
			link.click(function(){
				this_.openWindow(params.popupUrl + '?' + this_.getQuery(query), {
					width: params.pupupWidth,
					height: params.popupHeight,
					name: 'share_' + buttonName
				});
				return false;
			});			
		},

		updateCount: function(buttonName, count) {
			var buttonWrapper = $('.' + buttonName, this.container);
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