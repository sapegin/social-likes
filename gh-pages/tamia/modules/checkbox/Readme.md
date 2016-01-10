# Checkbox and radio button

Checkbox and radio button with custom design.


## Markup

Checkbox:

	<div class="checkbox">
		<input class="checkbox__input" id="my_checkbox" type="checkbox" name="my_checkbox" value="yes" checked="checked">
		<label class="checkbox__label" for="my_checkbox">
			<span class="checkbox__button"></span>
			<span class="checkbox__text">My checkbox</span>
		</label>
	</div>

Radio button:

	<div class="radiobutton">
		<input class="radiobutton__input" id="my_radio" type="checkbox" name="my_radio" value="dog" checked="checked">
		<label class="radiobutton__label" for="my_radio">
			<span class="radiobutton__button"></span>
			<span class="radiobutton__text">My radio button</span>
		</label>
	</div>


## Skin

Set `checkbox_default_skin` or `modules_default_skin` to `true` to enable default skin.
