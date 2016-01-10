# Tâmia © 2013 Artem Sapegin http://sapegin.me
# Flippable pane

'use strict'

$ = jQuery

class Flippable extends Component
	init: ->
		if @elem.hasClass('js-flip')
			@on('click', @toggle)
		else
			@on('click', 'flip', @toggle)

	toggle: ->
		@toggleState('flipped')
		@elem.trigger('flipped.tamia', @hasState('flipped'))

tamia.initComponents(flippable: Flippable)
