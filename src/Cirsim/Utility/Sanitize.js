import DOMPurify from 'dompurify';

/**
 * Basic Sanitize operations to protect from XSS.
 *
 * Some of this is a wrapper around DOMPurify's sanitize, so
 * it can be easily replaced in the future. Additional functions are
 * useful for sanitizing input from files.
 *
 * @constructor
 */
export const Sanitize = function() {
}

Sanitize.sanitize = function(text) {
    return DOMPurify.sanitize(text);
}

Sanitize.boolean = function(value) {
    return value === true;
}

/**
 * Replace <, >, and & with corresponding HTML entities.
 * @param text
 * @returns {string|XML|*}
 */
Sanitize.htmlentities = function(text) {
    text = text.replace(/&/g, '&amp;');
    text = text.replace(/</g, '&lt;');
    text = text.replace(/>/g, '&gt;');
    return text;
}

export default Sanitize;

