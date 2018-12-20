

/**
 * Convenience functions for the DOM.
 * Tools that avoid having to have jQuery installed.
 * @constructor
 */
export const Tools = function() {

}

/**
 * Is an element visible?
 * Borrowed from jQuery!
 * @param elem
 * @returns {boolean}
 */
Tools.isVisible = function( elem ) {
    return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};

/**
 * Add a class to an element
 * @param element Element to add to
 * @param className Class to add
 */
Tools.addClass = function(element, className) {
    if (element.classList)
        element.classList.add(className);
    else
        element.className += ' ' + className;
}

Tools.addClasses = function(element, classes) {
    if(classes === undefined || classes === null) {
        return;
    }

    classes.split(' ').forEach((cls) => {
        Tools.addClass(element, cls);
    });
}

Tools.removeClass = function(element, className) {
    let regEx = new RegExp('\\b' + className + '\\b', 'g');
    element.className = element.className.replace(regEx, "");
}

/**
 * Create a DIV with a provided class name.
 * @param className Class to add to the div
 * @param content Content to place in the div. HTML or Element
 * @returns {Element} Created DOM Element
 */
Tools.createClassedDiv = function(className, content) {
    let div = document.createElement('div');
    Tools.addClass(div, className);
    if(content !== undefined) {
	    Tools.addContent(div, content);
    }
    return div;
}

/**
 * Add content to an element.
 * @param element Element to add to
 * @param content Content. Can be HTML or an Element.
 */
Tools.addContent = function(element, content) {
    if(Tools.isString(content)) {
        element.innerHTML += content;
    } else if(Tools.isElement(content)) {
        element.appendChild(content);
    }
}

/**
 * Is the passed value a string?
 * @param val
 * @returns {boolean}
 */
Tools.isString = function(val) {
    return typeof val === 'string' || ((!!val && typeof val === 'object') && Object.prototype.toString.call(val) === '[object String]');
}

/**
 * Is the passed value an HTMLElement?
 * @param val
 * @returns {boolean}
 */
Tools.isElement = function(val) {
    return val !== undefined && val !== null && val.nodeValue !== undefined;
}

/**
 * Get the current position of an element (specifically its border box, which excludes margins) relative to the document.
 * @param element
 */
Tools.offset = function(element) {
	const rect = element.getBoundingClientRect();
	return {
	    left: rect.left + element.scrollLeft + window.pageXOffset,
        top: rect.top + element.scrollTop + window.pageYOffset
    }
}

/**
 * Find a child by tagName
 * @param element
 * @param tagName
 * @returns {*}
 */
Tools.child = function(element, tagName) {
	for(const node of element.childNodes) {
	    if(node.tagName === tagName) {
	        return node;
        }
	}

	return null;
}
