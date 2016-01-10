# Tâmia © 2013 Artem Sapegin http://sapegin.me
# Spinner

'use strict'

$ = jQuery


_wrapperClass = 'loader-wrapper'
_shadeSelector = '.loader-shade'
_loaderTmpl = '''
<div class="loader-shade">
	<div class="l-center">
		<div class="l-center-i">
			<div class="spinner spinner_big"></div>
		</div>
	</div>
</div>
'''


class Loader extends Component
	init: ->
		@initHtml()
		setTimeout((=> @addState('loading')), 0)

	destroy: ->
		@removeState('loading')
		@elem.find(_shadeSelector).afterTransition(=>
			@elem.removeClass(_wrapperClass)
			@loader.remove()
		)

	initHtml: ->
		@elem.addClass(_wrapperClass)
		@loader = $(_loaderTmpl)
		@elem.append(@loader)


# Events
tamia.registerEvents(
	'loading-start': (elem) ->
		container = $(elem)
		return  if container.data('loader')
		container.data('loader', new Loader(elem))

	'loading-stop': (elem) ->
		container = $(elem)
		loader = container.data('loader')
		return  if not loader
		loader.destroy()
		container.removeData('loader')
)
