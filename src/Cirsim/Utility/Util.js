/**
 * Utility functions
 * @constructor
 */
export const Util = function() {
}

/**
 * Convert a value to Hex
 * @param d Value to convert
 * @param len Number of digits to convert to.
 * @returns {string} Converted result.
 */
Util.toHex = function(d, len) {
    let hex = Number(d).toString(16);
    while(hex.length < len) {
        hex = '0' + hex;
    }

    return hex;
}


/**
 * Convert a value to Binary
 * @param d Value to convert
 * @param len Number of digits to convert to.
 * @returns {string} Converted result.
 */
Util.toBinary = function(d, len) {
	let bin = Number(d).toString(2);
	while(bin.length < len) {
		bin = '0' + bin;
	}

	return bin;
}

/**
 * Test if a string is in an array
 * @param needle String item to look for
 * @param haystack Array of strings
 * @return true if in array
 */
Util.inArray = function(needle, haystack) {
	for(let i=0; i<haystack.length; i++) {
		if(haystack[i].toLowerCase() === needle.toLowerCase()) {
			return true;
		}
	}

	return false;
}

export default Util;
