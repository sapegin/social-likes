export default {
	popupUrl: 'https://twitter.com/intent/tweet?url={url}&text={title}',
	popupWidth: 600,
	popupHeight: 450,
	click: function() {
		// Add a colon to improve readability
		if (!/[\.\?:\-–—]\s*$/.test(this.options.title)) {
			this.options.title += ':';
		}
		return true;
	}
};
