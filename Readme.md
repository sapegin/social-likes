# Social Likes

[![Powered by You](http://sapegin.github.io/powered-by-you/badge.svg)](http://sapegin.github.io/powered-by-you/)
[![Build Status](https://travis-ci.org/sapegin/social-likes.svg)](https://travis-ci.org/sapegin/social-likes)

**[Try the all new Social Likes Next](http://social-likes-next.js.org/): no jQuery, no counters, Retina, IE11+, improved skins.**

Beautiful share buttons with counters for popular social networks: Facebook, Twitter, Google+, Pinterest, Vkontakte, etc. Uses jQuery.

[![](http://wow.sapegin.me/image/1f1U2S130d3R/social-likes.png)](http://sapegin.github.io/social-likes/)

[See demo](http://sapegin.github.io/social-likes/)

## Features

- Easy to install.
- Beautiful and all in one style (with three different skins).
- Won’t explode your page’s layout.


## Installation and configuration

Use [interactive builder](http://sapegin.github.io/social-likes/) to generate the code.

Or install via npm: `npm install --save social-likes`.


## Advanced configuration

### Layout

#### Default

All buttons in a row.

```html
<div class="social-likes">
	<div class="facebook" title="Share link on Facebook">Facebook</div>
	...
</div>
```

#### Vertical

All buttons in a column.

```html
<div class="social-likes social-likes_vertical">
	<div class="facebook" title="Share link on Facebook">Facebook</div>
	...
</div>
```

#### Single button

One button with a counter (sum of all the networks). Opens popup with like buttons in vertical layout. Use `data-single-title` attribute to change button title.

```html
<div class="social-likes social-likes_single" data-single-title="Share me!">
	<div class="facebook" title="Share link on Facebook">Facebook</div>
	...
</div>
```

#### Icons only

If you want to remove button titles add `social-likes_notext` class to make it looks better.

```html
<div class="social-likes social-likes_notext">
	<div class="facebook" title="Share link on Facebook"></div>
	...
</div>
```


### Options

Options define via HTML data attributes or JavaScript parameters object.

`url`

URL of shareable page. Current page by default.

`title`

Title for Twitter, Vkontakte and LiveJournal. Current page’s title by default.

`html`

HTML code for LiveJournal button. By default <A> tag with link to current page.

`counters`

Disables “likes” counters when “no”. Default: “yes”.

`zeroes`

Show counters even when number is `0`. Default: “no”.

`single-title`

Share button title for “single button” mode. Default: “Share”.

Examples:

```html
<div class="social-likes" data-url="http://landscapists.info/" data-title="Landscapists of Russia">
	…
</div>
```

```html
<div class="social-likes social-likes_single" data-single-title="This is Sharing!">
	…
</div>
```

```js
$('.social-likes').socialLikes({
	url: 'https://github.com/sapegin/social-likes/',
	title: 'Beautiful “like” buttons with counters for popular social networks',
	counters: true,
	singleTitle: 'Share it!'
});
```


### Services specific options

#### Twitter

You can specify `via` (site’s or your own Twitter) and `related` (any other Twitter you want to advertise) values for `<div class="twitter">`:

```html
<div class="twitter" data-via="sapegin" data-related="Landscapists">Twitter</div>
```

#### Pinterest

You should specify an image URL via data-media attribute on `<div class="pinterest">`:

```html
<div class="pinterest" data-media="http://example.com/image/url.jpg">Pinterest</div>
```

### Manual initialization

Could be useful on dynamic (AJAX) websites.

```html
<div id="share">
	<div class="facebook">Facebook</div>
	...
</div>
```

```javascript
$('#share').socialLikes();
```


### Dynamic URL changing

You can dynamically replace URL, title and Pinterest image without reinitialization.

```html
<div id="share2" class="social-likes" data-url="http://example.com/" data-title="My example">
	<div class="facebook">Facebook</div>
	...
</div>
```

```javascript
$('#share2').socialLikes({
	url: 'https://github.com/',
	title: 'GitHub',
	data: {
		media: 'http://birdwatcher.ru/i/userpic.jpg'  // Image for Pinterest button
	}
});
```


### Refreshing counters

By default counters for any unique URL requested only once. You can force new request with `forceUpdate` option:

```javascript
$('#share2').socialLikes({
	forceUpdate: true
});
```


### Events

#### `counter.social-likes`

Triggers for every counter.

```javascript
$('.social-likes').on('counter.social-likes', function(event, service, number) {
	// service: facebook, twitter, etc.
});
```

#### `ready.social-likes`

Triggers after all counters loaded.

```javascript
$('.social-likes').on('ready.social-likes', function(event, number) {
	// number is total number of shares
});
```

#### `popup_opened.social-likes`

Triggers after popup window opened.

```javascript
$('.social-likes').on('popup_opened.social-likes', function(event, service, win) {
	// win is popup window handler (window.open())
});
```

#### `popup_closed.social-likes`

Triggers after popup window closed.

```javascript
$('.social-likes').on('popup_closed.social-likes', function(event, service) {
	// Request new counters
	$(event.currentTarget).socialLikes({forceUpdate: true});

	// Or just increase the number
	var counter = $(event.currentTarget).find('.social-likes__counter_' + service);
	counter.text(+(counter.text()||0)+1).removeClass('social-likes__counter_empty');
});
```


### Adding your own button

You can find some custom buttons in `contrib` folder.

Define `socialLikesButtons` object:

```javascript
var socialLikesButtons = {
	surfingbird: {
		popupUrl: 'http://surfingbird.ru/share?url={url}',
		popupWidth: 650,
		popupHeight: 500
	}
};
```

Or with a custom click handler:

```javascript
var socialLikesButtons = {
	livejournal: {
		click: function(e) {
			// this.widget.data('something')
		}
	}
};
```

Add some CSS:

```css
.social-likes__button_surfingbird {
	background: #f2f3f5;
	color: #596e7e;
	border-color: #ced5e2;
	}
.social-likes__icon_surfingbird {
	background: url(http://surfingbird.ru/img/share-icon.png) no-repeat 2px 3px;
	}
```

And use it like any other button:

```html
<div class="surfingbird">Surf</div>
```

See sources (`src` folder) for available options and class names and `contrib` folder for custom buttons examples.


## FAQ

### Likes or shares?

This plugin allows your users to “share” the content of your website. (Un)fortunately¹ real “likes” are possible only when you use original Facebook, Google+, etc. buttons.

¹ I believe that “shares” are much better and valuable than “likes” because they’re more visible in feed and users could add they’re own comments to links they share. “Like” costs nothing.

### How to change title, description and image

You can use [Open Graph](http://ogp.me/). It works for [Facebook](http://davidwalsh.name/facebook-meta-tags), Twitter, [Google+](https://developers.google.com/+/web/snippet/), [Pinterest](http://developers.pinterest.com/rich_pins/) and [Vkontakte](http://vk.com/dev/widget_like)). 

You can add additional Twitter data using [Twitter Card](https://dev.twitter.com/cards/overview). You have to [approve](https://dev.twitter.com/docs/cards/validation/validator) every type of Twitter Card.

```html
<meta property="og:type" content="article">
<meta property="og:url" content="{page_url}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="{image_url}">
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@SiteTwitter">
<meta name="twitter:creator" content="@sapegin">
```

If you’re experiencing any problems with meta data try [Open Graph Debugger](https://developers.facebook.com/tools/debug/) and [Twitter Card Validator](https://dev.twitter.com/docs/cards/validation/validator).

### How to fix Twitter counter

Twitter counter API [was disabled by Twitter](https://github.com/sapegin/social-likes/releases/tag/3.0.15) but you can replace it with [OpenShareCount](http://opensharecount.com/). It’s free but you have to register your site there.

1. [Create account](http://opensharecount.com/) at OpenShareCount.

2. Add this script before you include `social-likes.js`:

```html
<script>
var socialLikesButtons = {
  twitter: {
    counterUrl: 'https://opensharecount.com/count.json?url={url}&callback=?',
    convertNumber: function(data) {
      return data.count;
    }
  }
};
</script>
```

### How to use Social Likes with Wordpress, etc.

See [wiki](https://github.com/sapegin/social-likes/wiki/How-to-use-Social-Likes-with-Wordpress,-etc.).

### How to track activity with Google Analytics

You can track how many people click on each social button on your site with Google Analytics (or other analytics service). Note that you can track clicks only, not real shares.

```javascript
$(document).on('popup_opened.social-likes', function(event, service) {
    ga('send', 'social', service, 'share', location.href);
});
```

## Troubleshooting

### The buttons don’t work, displayed without design or don’t displayed at all

First look at your [browser’s console](http://www.wickedlysmart.com/hfjsconsole/). If you see an error “Uncaught ReferenceError: jQuery is not defined”:

![](http://wow.sapegin.me/image/1f1h1d0z2d1j/Image%202014-11-19%20at%205.45.14%20PM.png)

Then you need to include jQuery into your page. Make sure you use version at least 1.7 (and lower than 2.0 if you need to support IE8) and you include jQuery before `social-likes.js`. The easiest way to do it is to use Google CDN:

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
```

If you don’t see any error check the following:

1. `social-likes.js` is included after jQuery and the path is correct.

2. `social-likes_flat.css` or `social-likes_classic.css` or `social-likes_birman.css` is included in <head> of your page and the path is correct.

So you need your page to look like this:

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Welcome to my site!</title>
	<link href="social-likes_birman.css" rel="stylesheet">
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="social-likes.js"></script>
	...
```

### Counters don’t work

**Twitter counter was disabled in [3.0.15](https://github.com/sapegin/social-likes/releases/tag/3.0.15).**

In most cases if you don’t see counters it’s because social networks APIs return zeros. You could check API requests results in Network tab in your browser’s developer tools:

![](https://d3vv6lp55qjaqc.cloudfront.net/items/2F3F0u0Q0D1D3u142X0d/Image%202014-03-06%20at%205.33.14%20%D0%BF%D0%BE%D1%81%D0%BB%D0%B5%20%D0%BF%D0%BE%D0%BB%D1%83%D0%B4%D0%BD%D1%8F.png)

Double check that you use canonical URLs (without extra parameters such as `utm_source`). You can change URL via [`data-url` option](#options).

If you have more than one Social Likes blocks on a page with different URLs, Google+ counter will work only for the first block. Google+ counter also won’t work when you refresh counters with `forceUpdate` option or change URL dynamically.

If your site have internationalized domain name (e.g. `президент.рф`) make sure you convert it to [Punycode](https://en.wikipedia.org/wiki/Punycode) (e.g. `xn--d1abbgf6aiiy.xn--p1ai`).

If you’re sure that it’s a bug please file an issue **and provide a link** to a page with non-working counter.

## Release History

The changelog can be found on the [Releases page](https://github.com/sapegin/social-likes/releases).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](Contributing.md).

## Author

* [Artem Sapegin](http://sapegin.me/)


---

## License

The MIT License, see the included [license.md](license.md) file.
