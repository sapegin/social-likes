# Social Likes

Beautiful “like” buttons with counters for popular social networks: Facebook, Twitter, LiveJournal, etc. Uses jQuery.


## Features

- Easy to install.
- Beautiful and all in one style.
- Won’t explode your page’s layout.


## Installation and configuration

Use [interactive builder](http://sapegin.github.com/social-likes) to generate code.


## Advanced configuration

### Options

Options define via HTML data attributes.

`url`

URL of shareable page. Current page by default.

`title`

Title for Twitter, Vkontakte and LiveJournal. Current page’s title by default.

`html`

HTML code for LiveJournal and “Code” buttons. By default <A> tag with link to current page.

`counters`

Disables “likes” counters when “no”. Default: “yes”.

`prompt`

Text for code bubble. Default: “Copy code to clipboard:”.

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

TODO:
Twitter via etc.


### Adding your own button

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

See sources (`src` folder) for available options and class names.



---

## License

The MIT License, see the included `License.md` file.
