/**
 * @file
 * Utility functions
 */

var Util = function() {
}

/**
 * Convert a value to Hex
 * @param d Value to convert
 * @param len Number of digits to convert to.
 * @returns {string} Converted result.
 */
Util.toHex = function(d, len) {
    var hex = Number(d).toString(16);
    while(hex.length < len) {
        hex = '0' + hex;
    }

    return hex;
}

export default Util;
