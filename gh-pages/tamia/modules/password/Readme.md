# Password field

Password field with toggle to show characters.


## Markup

	<div class="password" data-component="password">
		<span class="password__toggle js-toggle"></span>
		<input type="password" class="password__field field js-field">
	</div>


## States

### .password.is-ok

Browser is supported.

### .password.is-unlocked

Password characters are visible.


## Caveats

IE9+.


## Skin

Set `password_default_skin` or `modules_default_skin` to `true` to enable default skin.
