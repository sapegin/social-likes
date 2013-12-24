# Tâmia © 2013 Artem Sapegin http://sapegin.me
# Basic form controls

'use strict'

$ = jQuery


_formElementsSelector = '.field,.button,.disablable'
_disabledClass = 'is-disabled'

_enableDisable = (elem, enable) ->
	formElements = ($ elem).find(_formElementsSelector).addBack(_formElementsSelector)
	formElements[if enable then 'removeClass' else 'addClass'](_disabledClass)
	formElements.attr('disabled', !enable)


# Events
tamia.registerEvents(
	###
	Enables all descendant form elements.
	###
	enable: (elem) ->
		_enableDisable elem, true

	###
	Disables all descendant form elements.
	###
	disable: (elem) ->
		_enableDisable elem, false
)
