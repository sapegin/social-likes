casper = require('casper').create()

casper.count = (s) ->
	@evaluate ((s) ->
		__utils__.findAll(s).length
	), {s}

casper.checkCounter = (s) ->
	@waitForSelector ".first .social-likes__counter_#{s}", ->
		first = @fetchText ".first .social-likes__counter_#{s}"
		third = @fetchText ".third .social-likes__counter_#{s}"
		@test.assert first > 0
		@test.assertEqual first, third


casper.start "src/test.html"


# Ensure DOM tree was created
casper.then ->
	# TODO: check _facebook bla-bla
	# TODO: check single and other types
	@test.assertEqual @count("ul.social-likes > li.social-likes__widget > span.social-likes__button > span.social-likes__icon"), 24

# Counters
casper.checkCounter('facebook')
casper.checkCounter('twitter')
casper.checkCounter('mailru')
casper.checkCounter('vkontakte')
casper.checkCounter('odnoklassniki')
casper.checkCounter('plusone')


# TODO: Popup URLs (200)

casper.run ->
	@test.renderResults true
