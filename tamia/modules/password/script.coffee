# Tâmia © 2013 Artem Sapegin http://sapegin.me
# Password field with toggle to show characters

'use strict'

$ = jQuery

supported = undefined

class Password extends Component
	init: ->
		@types =
			locked: 'password'
			unlocked: 'text'

		@fieldElem = @find('field')
		@toggleElem = @find('toggle')

		# Mousedown instead of click to catch focused field
		@on('mousedown', 'toggle', @toggle)

	isSupported: ->
		return supported  unless supported is undefined

		# IE8+
		supported = $('<!--[if lte IE 8]><i></i><![endif]-->').find('i').length isnt 1
		return supported

	toggle: ->
		focused = document.activeElement is @fieldElem[0]
		locked = @hasState('unlocked')

		fieldType = @fieldElem.attr('type')

		@toggleState('unlocked')

		if fieldType is @types.locked and not locked
			@fieldElem.attr('type', @types.unlocked)
		else if fieldType is @types.unlocked and locked
			@fieldElem.attr('type', @types.locked)

		if focused
			setTimeout((=> @fieldElem.focus()), 0)

tamia.initComponents(password: Password)
