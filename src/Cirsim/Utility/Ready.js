/**
 * Simple Document ready function, equivalent to jQuery's document ready.
 * @constructor
 */
export const Ready = function() {
}

/**
 * Call a function when the document is readon.
 * @param fn Function to be called on document ready
 */
Ready.go = function(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}
