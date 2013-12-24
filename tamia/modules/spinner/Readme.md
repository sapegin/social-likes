# Spinner

Loading indicator (spinner) with animation.


## Markup

	<div class="spinner"></div>

	<div class="is-loading">
		<div class="loader"></div>
	</div>

`.loader` is the same as `.spinner` but it’s hidden by default. It’s visible only when `.is-loading` state is set on ancestor element.

## Modifiers

### .spinner.spinner_big

Bigger size.


## More sizes

You can set any spinner size changing `font-size` property.

	.spinner_huge
		font-size: 64px

	<div class="spinner spinner_huge"></div>


## Component loading indicator

	$('.pony').trigger('loading-start.tamia');  // Show loader
	$('.pony').trigger('loading-stop.tamia');  // Hide loader

That will blocks all container’s content with a semi transparent layer and shows spinner in the middle.

To change shade layer’s color set `loader_shade_color` variable.


## IE 8—9 callback

Copy `spinner.gif` to your images folder and set `spinner_fallback_gif` variable to its URL.
