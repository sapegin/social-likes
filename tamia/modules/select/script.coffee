# Tâmia © 2013 Artem Sapegin http://sapegin.me
# Select with custom design

'use strict'

$ = jQuery

class Select extends Component
	init: ->
		@selectElem = @find('select')
		@boxElem = @find('box')

		@on('focus', 'select', @focus)
		@on('blur', 'select', @blur)
		@on('change', 'select', @change)

		@change()

	focus: ->
		@addState('focused')

	blur: ->
		@removeState('focused')

	change: ->
		@boxElem.text(@selectElem.find(':selected').text())

tamia.initComponents(select: Select)
