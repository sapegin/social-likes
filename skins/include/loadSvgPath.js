var fs = require('fs');
var path = require('path');

function getAllMatches(string, regexp) {
	var match;
	var matches = [];
	do {
		match = regexp.exec(string);
		if (match) {
			matches.push(match[1]);
		}
	} while (match);
	return matches;
}

/**
 * Returns a path of an SVG <path> tag.
 *
 * Example:
 *
 *   loadSvgPath('facebook.svg') -> M13 0H3C1 0 0 1 0 3v10c0...
 */
module.exports = function() {
	return function(style) {
		style.define('loadSvgPath', function(params) {
			var filepath = path.resolve(path.dirname(params.filename), params.val);
			var svg = fs.readFileSync(filepath, {encoding: 'utf8'});
			var paths = getAllMatches(svg, /<path d="([^"]+)"/g);
			if (paths.length) {
				return paths.join(';');
			}
			else {
				throw new Error('Cannot find SVG path in ' + filepath);
			}
		});
	};
};
