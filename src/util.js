import { prefix } from './config';

/**
 * Object.assign ponyfill.
 *
 * @param {Object} target
 * @param {Object} ...sources
 */
let assign;
if (Object.assign) {
	assign = Object.assign;
}
else {
	// https://github.com/rubennorte/es6-object-assign/
	assign = function(target) {
		if (process.env.NODE_ENV === 'development' && (target === undefined || target === null)) {
			throw new TypeError('assign: cannot convert first argument to object');
		}

		let to = Object(target);
		for (let i = 1; i < arguments.length; i++) {
			let nextSource = arguments[i];
			if (nextSource === undefined || nextSource === null) {
				continue;
			}

			let keysArray = Object.keys(Object(nextSource));
			for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
				let nextKey = keysArray[nextIndex];
				let desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
				if (desc !== undefined && desc.enumerable) {
					to[nextKey] = nextSource[nextKey];
				}
			}
		}
		return to;
	};
}
export { assign };

/**
 * Return node.dataset or plain object for IE 10.
 * Based on https://gist.github.com/brettz9/4093766#file_html5_dataset.js
 *
 * @param {Node} node DOM node.
 * @return {Object}
 */
export function dataset(node) {
	if (typeof node.dataset === 'object') {
		return node.dataset;
	}

	let data = {};
	for (let idx = 0; idx < node.attributes.length; idx++) {
		let attribute = node.attributes[idx];
		if (attribute && attribute.name && (/^data-\w[\w\-]*$/).test(attribute.name)) {
			let name = attribute.name.substr(5).replace(/-./g, n0 => n0.charAt(1).toUpperCase());
			data[name] = attribute.value;
		}
	}

	return data;
}

/**
 * Append params to the URL.
 *
 * @param {String} url Base URL.
 * @param {Object} params Params to append.
 * @return {String}
 */
export function addParamsToUrl(url, params) {
	params = objectToQueryString(params);
	if (!params) {
		return url;
	}

	let glue = url.indexOf('?') === -1 ? '?' : '&';
	return url + glue + params;
}

/**
 * Convert object to a query string: a=1&b=2.
 *
 * @param {Object} params Parameters.
 * @return {String}
 */
export function objectToQueryString(params) {
	return Object.keys(params).reduce((pairs, key) => {
		pairs.push(key + '=' + encodeURIComponent(params[key]));
		return pairs;
	}, []).join('&');
}

/**
 * Open popup window.
 *
 * @param {String} url URL.
 * @param {Number} options.width Width.
 * @param {Number} options.height Height.
 * @param {String} options.name Window name.
 * @return {Object}
 */
export function openPopup(url, { width, height, name }) {
	let left = Math.round(screen.width / 2 - width / 2);
	let top = 0;
	if (screen.height > height) {
		top = Math.round(screen.height / 3 - height / 2);
	}

	let win = window.open(url, name, `
		left=${left},
		top=${top},
		width=${width},
		height=${height},
		personalbar=0,
		toolbar=0,
		scrollbars=1,
		resizable=1
	`);
	if (win) {
		win.focus();
		return win;
	}
	else {
		location.href = url;
		return null;
	}
}

/**
 * Template with encodeURIComponent for URLs.
 *
 * @param {String} url URL template.
 * @param {Object} context Replacements object.
 * @return {String}
 */
export function makeUrl(url, context) {
	return template(url, context, encodeURIComponent);
}

/**
 * Simple template.
 *
 * @param {String} tmpl Template.
 * @param {Object} context Replacements object.
 * @param {Function} [filter] Value filter function.
 * @return {String}
 */
export function template(tmpl, context, filter) {
	return tmpl.replace(/\{([^\}]+)\}/g, function(m, key) {
		let value = filter ? filter(context[key]) : context[key];
		// If key doesn't exists in the context we should keep template tag as is
		return key in context ? value : m;
	});
}

/**
 * Generates BEM class names for a block or element.
 * Block name is fixed to the ${prefix} value.
 *
 * @param {String} [elem] Element name.
 * @param {String} [mod] Modifier.
 * @return {String}
 */
export function className(elem, mod) {
	let base = prefix + (elem ? `__${elem}` : '');
	return base +
		(mod ? ` ${base}_${mod}` : '')
	;
}

/**
 * Read CSS content property.
 *
 * @param {HTMLElement} node DOM node.
 * @return {String}
 */
export function readCssContent(node) {
	return getComputedStyle(node).content.replace(/"/g, '');
}

/**
 * Returns SVG code of an icon.
 *
 * @param {String} pathData SVG path of an icon.
 * @param {String} cls CSS class name.
 * @return {String}
 */
export function svg(pathData, cls) {
	let paths = pathData.split(';').map(p => `<path d="${p}"/>`);
	return `
		<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
			${paths}
		</svg>
	`;
}
