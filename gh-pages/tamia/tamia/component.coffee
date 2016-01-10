# Tâmia © 2013 Artem Sapegin http://sapegin.me
# https://github.com/sapegin/tamia
# JS component base class

'use strict'

$ = jQuery

###
JS component base class.

Elements: any HTML element with class name that follow a pattern `.js-name` where `name` is an element name.

States: any class on component root HTML node that follow a pattern `.is-state` where `state` is a state name.
After initialization all components will have `ok` state.

Example:

  class Pony extends Component
    init: ->
      @on('click', 'toggle', @toggle)
    toggle: ->
      @toggleState('pink')

  tamia.initComponents(pony: Pony)

  <div class="pink-pony is-pink" data-component="pony">
    <button class="pink-pony__button js-toggle">To pink or not to pink?</div>
  </div>
###
class Component
	constructor: (elem) ->
		if not elem or elem.nodeType isnt 1 then throw new ReferenceError('No DOM node passed to Component constructor.')

		@elemNode = elem
		@elem = $(elem)
		@initializable = @isInitializable()
		if not @initializable
			return
		@_fillStates()
		if @isSupported()
			@handlers = {}
			@init()
			@addState('ok')
		else
			@fallback()
			@addState('unsupported')


	###
	Put all your initialization code in this method.
	###
	init: ->
		# Should be implemented

	###
	You can implement this method to do destroy component.
	###
	destroy: ->
		# Could be implemented

	###
	Implement this method if you want to check whether browser is good for your component or not.

	@returns {Boolean}
	###
	isSupported: ->
		return true

	###
	Implement this method if you want to check whether component could be initialized.

	Example:

	  isInitializable: ->
	    # Do not initialize component if it's not visible
	    @isVisible()

	@return {Boolean}
	###
	isInitializable: ->
		return true

	###
	You can implement this method to do some fallbacks. It will be called if isSupported() returns false.
	###
	fallback: ->
		# Could be implemented

	###
	Finds element.

	@param {String} name Element ID.

	@return {jQuery} Element with .js-name class.
	###
	find: (name) ->
		return @elem.find(".js-#{name}").first()

	###
	Attaches event handler.

	@param {String} events Event names (space separated).
	@param {String} [element] Element id.
	@param {Function} handler Handler function (scope will automatically sets to this).
	###
	on: (args...) ->
		@_toggleEvent('on', args...)

	###
	Detaches event handler.

	@param {String} events Event names (space separated).
	@param {String} [element] Element id.
	@param {Function} handler Handler function (scope will automatically sets to this).
	###
	off: (args...) ->
		@_toggleEvent('off', args...)

	###
	Returns component state.

	@param {String} [name] State name.

	@return {Boolean} Sate value.
	###
	hasState: (name) ->
		return !!@states[name]

	###
	Sets state to true.

	@param {String} [name] State name.
	###
	addState: (name) ->
		@toggleState(name, true)

	###
	Sets state to false.

	@param {String} [name] State name.
	###
	removeState: (name) ->
		@toggleState(name, false)

	###
	Toggles state value.

	@param {String} [name] State name.
	@param {Boolean} [value] State value.
	###
	toggleState: (name, value = not @states[name]) ->
		@states[name] = value
		@_updateStates()

	###
	Returns component visibility.

	@return {Boolean}
	###
	isVisible: ->
		return !!(@elemNode.offsetWidth or @elemNode.offsetHeight)

	_toggleEvent: (action, args...) ->
		if typeof args[1] is 'string'
			# Selector passed
			args[1] = ".js-#{args[1]}"

		# Bind handler to this
		funcArg = args.length - 1  # Last argument
		func = args[funcArg]
		handler
		if @handlers[func]
			handler = @handlers[func]
		if action is 'on'
			if handler
				handler.counter++
			else
				@handlers[func] = handler =
					counter: 1
					func: func.bind(this)
		return  if not handler
		args[funcArg] = handler.func

		# Pass to jQuery
		@elem[action](args...)

		# Clean up
		if action is 'off'
			handler.counter--
			if handler.counter <= 0
				@handlers[func] = null

	_fillStates: ->
		states = {}
		classes = @elemNode.className.split(' ')
		for clsName of classes
			cls = classes[clsName]
			re = /^is-/
			if re.test(cls)
				states[cls.replace(re, '')] = true
		@states = states

	_updateStates: ->
		classes = @elemNode.className
		classes = $.trim(classes.replace(/\bis-[-\w]+/g, ''))
		classes = classes.split(/\s+/)
		for name of @states
			if @states[name]
				classes.push("is-#{name}")
		@elemNode.className = classes.join(' ')

Component.__tamia_cmpnt__ = true

window.Component = Component
