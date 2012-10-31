$.tagsClasses = function(prefix, tags) {
	var classes = [prefix];
	for (var tagIdx = 0; tagIdx < tags.length; tagIdx++) {
		classes.push(prefix + '_' + tags[tagIdx]);
	}
	return classes.join(' ');
};

$.getPage = function(page) {
	return $.map[$.lang + '/' + page];
};

$.getBodyClasses = function() {
	if (!$.bodyClasses) return '';
	return $.bodyClasses.join(' ');
};

$.getTranslationUrl = function(lang) {
	var translation = $.map[$.path.replace($.lang, lang)];
	return translation ? translation.url : $.map[lang + '/index'].url;
};
