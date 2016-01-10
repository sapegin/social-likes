/* Author: Artem Sapegin, http://sapegin.me, 2012 */

/*jshint browser:true, jquery:true, white:false, smarttabs:true, eqeqeq:true,
         immed:true, latedef:true, newcap:true, undef:true */
/*global jQuery:false, define:false*/
(function (factory) {  // Try to register as an anonymous AMD module
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else {
		factory();
	}
}(function () {
	'use strict';

	var regexps = [
		[/<(\/?)([\w]+)([^>]*)>/g, '←<$1→←tag:$2→$3←>→'],  // Tag
		[/ ([\-\w]+)/g, ' ←attr:$1→']  // Attribute
	],
	saveStringsRe = [
		/"([^"]+)"/mg
	],
	restoreStringsRe = /↑(\d+)↓/g,
	savedStrings,
	savedStringsNum;

	function save_strings(code) {
		function save(s) {
			savedStrings[savedStringsNum] = s;
			return '↑' + savedStringsNum++ + '↓';
		}

		savedStringsNum = 0;
		savedStrings = [];
		for (var reIdx = 0; reIdx < saveStringsRe.length; reIdx++) {
			code = code.replace(saveStringsRe[reIdx], save);
		}
		return code;
	}

	function restore_strings(code) {
		code = code.replace(restoreStringsRe, function(s, num) {
			return savedStrings[num];
		});
		savedStringsNum = 0;
		savedStrings = [];
		return code;
	}

	function highlight(code) {
		code = save_strings(code);
		for (var regexpIdx = 0; regexpIdx < regexps.length; regexpIdx++) {
			var re = regexps[regexpIdx];
			code = code.replace(re[0], re[1]);
		}
		code = restore_strings(code);
		code = code.replace(/\=("[^\"]*")/g, '←=→←str:$1→');  // Attribute values
		return code;
	}

	function htmlize(code) {
		return code
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/←([^:→]+)→/g, '←gray:$1→')
			.replace(/←(\w+):([^→]+)→/g, '<span class="hl-$1">$2</span>')
		;
	}

	return (window.htmlhl = function(code) {
		return htmlize(highlight(code));
	});
}));
