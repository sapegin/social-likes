# Social Likes

[![Bower version](https://badge.fury.io/bo/social-likes.png)](http://badge.fury.io/bo/social-likes)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Beautiful “like” buttons with counters for popular social networks: Facebook, Twitter, LiveJournal, etc. Uses jQuery.


## Features

- Easy to install.
- Beautiful and all in one style.
- Won’t explode your page’s layout.


## Installation and configuration

Use [interactive builder](http://sapegin.github.io/social-likes/) to generate the code.

Or install via [Bower](http://bower.io/): `$ bower install social-likes`.


## Advanced configuration

### Layout

#### Default

All buttons in a row.

```
<ul class="social-likes">
	<li class="facebook" title="Share link on Facebook">Facebook</li>
	...
</ul>
```

#### Vertical

All buttons in a column.

```
<ul class="social-likes social-likes_vertical">
	<li class="facebook" title="Share link on Facebook">Facebook</li>
	...
</ul>
```

#### Single button

One button with a counter (summ of all the networks). Opens popup with like buttons in vertical layout. Use `data-single-title` attribute to change button title.

```
<ul class="social-likes social-likes_single" data-single-title="Share me!">
	<li class="facebook" title="Share link on Facebook">Facebook</li>
	...
</ul>
```

#### Icons only

If you want to remove button titles add `social-likes_notext` class to make it looks better.

```
<ul class="social-likes social-likes_notext">
	<li class="facebook" title="Share link on Facebook"></li>
	...
</ul>
```


### Options

Options define via HTML data attributes.

`url`

URL of shareable page. Current page by default.

`title`

Title for Twitter, Vkontakte and LiveJournal. Current page’s title by default.

`html`

HTML code for LiveJournal button. By default <A> tag with link to current page.

`counters`

Disables “likes” counters when “no”. Default: “yes”.

`single-title`

Share button title for “single button” mode. Default: “Share”.

Examples:

```html
<ul class="social-likes" data-url="http://landscapists.info/" data-title="Landscapists of Russia">
	…
</ul>
```

```html
<ul class="social-likes social-likes_single" data-single-title="This is Sharing!">
	…
</ul>
```

### Services specific options

#### Twitter

You can specify `via` (site’s Twitter) and `related` (any other Twitter you want to advertise) values for `<li class="twitter">`:

```html
<li class="twitter" data-via="sapegin" data-related="Landscapists">Twitter</li>
```

#### Pinterest

You should specify an image URL via data-media attribute on `<li class="pinterest">`:

```html
<li class="pinterest" data-media="http://example.com/image/url.jpg">Pinterest</li>
```

### Manual initialization

Could be useful on dynamic (Ajax) websites.

```html
<ul id="share">
	<li class="facebook">Facebook</li>
	...
</ul>
```

```javascript
$('#share').socialLikes();
```


### Events

#### `counter.social-likes`

Triggers for every non-zero counter.

```javascript
$('.social-likes').on('counter.social-likes', function(event, service, number) {
	// service: facebook, twitter, etc.
});
```

### Experimental Google+ counter

Place `googleplusonecount.php` somewhere on your server. And change buttons HTML like this:

```html
<li class="plusone" data-counter="http://example.com/path/to/googleplusonecount.php?url={url}&amp;callback=?">Google+</li>
```

### Adding your own button

You can find some custom buttons in `contrib` folder.

Define `socialLikesButtons` hash:

```javascript
var socialLikesButtons = {
	surfingbird: {
		popupUrl: 'http://surfingbird.ru/share?url={url}',
		pupupWidth: 650,
		popupHeight: 500
	}
};
```

If you know the social network search page's url, you can make a link to results of searching in this network. There are search urls for Twitter and VKontakte by default.

```javascript
var socialLikesButtons = {
	twitter: {
		...
		searchUrl: 'https://twitter.com/search?src=typd&q={url}'
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

And use in like any other button:

```html
<li class="surfingbird">Surf</li>
```

See sources (`src` folder) for available options and class names and `contrib` folder for custom buttons examples.


### How to change title, description and image

You can use [Open Graph](http://ogp.me/). It works for [Facebook](http://davidwalsh.name/facebook-meta-tags), Twitter, [Google+](https://developers.google.com/+/web/snippet/), [Pinterest](http://developers.pinterest.com/rich_pins/) and [Vkontakte](http://vk.com/dev/widget_like)). 

You can add additional Twitter data using [Twitter Card](https://dev.twitter.com/docs/cards).

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


### How to use Social Likes with Wordpress, etc.

See [wiki](https://github.com/sapegin/social-likes/wiki/How-to-use-Social-Likes-with-Wordpress,-etc.).

## Release History

### 2013-12-23 v2.0.13

* `searchUrl` option (by [@pivchanskiy](https://github.com/pivchanskiy)).
* Imporove `socialLikesButtons` object handling (by [@ironlion](https://github.com/ironlion)).

### 2013-08-26 v2.0.12

* Icons only mode (by [@albburtsev](https://github.com/albburtsev)).

### 2013-08-08 v2.0.11

* `counter.social-likes` event (#32).

### 2013-06-20 v2.0.10

* Prevent layout breaking without labels (#31).

### 2013-04-23 v2.0.8

* New Odnoklassniki API.
* Improved manual initialization.
* Compress CSS with CSSO.

### 2013-02-05 v2.0.7

* `data-title` and `data-url` attributes (by [@jalkoby](https://github.com/jalkoby)).
* Pinterest button (mostly by [@jalkoby](https://github.com/jalkoby)).
* Code button removed.


---

## License

The MIT License, see the included `License.md` file.
