# Flippable pane

Vertical or horizontal flippable pane. With 3D animation.


# Markup

	<div class="flippable js-flip" data-component="flippable">
		<div class="flippable__front">Front</div>
		<div class="flippable__back">Back</div>
	</div>


## Modifiers

### .flippable.flippable_vertical

Vertical rotation (horizontal by default).


## States

### .flippable.is-flipped

Back side is visible.


## Events

### flipped.tamia

Fires on every flip. Argument will be `true` if back side is visible.


## JS Hooks

### .js-flip

Element that flips pane when clicked.
