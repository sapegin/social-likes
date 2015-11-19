import { prefix } from './config';
import SocialLikes from './social-likes';

// Symbol to store an instance reference in a DOM node
const symbol = Symbol(prefix);

/**
 * Initialize Social Likes on a DOM element.
 *
 * @param {HTMLElement} elem DOM element.
 * @param {Object} [options] Options.
 * @return {SocialLikes}
 */
function init(elem, options = {}) {
	let instance = elem[symbol];
	if (instance) {
		instance.update(options);
	}
	else {
		elem[symbol] = new SocialLikes(elem, options);
	}
	return instance;
}

function autoInit(wait = false) {
	let elements = document.querySelectorAll(`.${prefix}`);
	if (elements) {
		[...elements].forEach(init);
	}
	else if (wait) {
		// No elements foud. Wait for DOM content loaded to try again in case the script was included in the <head>.
		document.addEventListener('DOMContentLoaded', autoInit);
	}
}

// Auto initialization
autoInit(true);

// Expose
export default init;
