/**
 * Set the Webpack public path so it knows where to load
 * CSS and images relative to. This must be imported before any other
 * imports.
 */

function getScriptDir() {
    const re = /^.*\/\/[^\/]+(\/.*\/)[^\/]+.js$/;
    const result = document.currentScript.src.match(re);
    if(result !== null) {
        return result[1];
    }

    return '';

    // var scriptElements = document.getElementsByTagName('script');
    // for (var i = 0; i < scriptElements.length; i++) {
    //     var source = scriptElements[i].src;
    //     var ndx = source.indexOf('/cirsim.js');
    //     if (ndx > -1) {
    //         return source.substring(0, ndx);
    //     }
    //
    //     var ndx = source.indexOf('/cirsim.min.js');
    //     if (ndx > -1) {
    //         return source.substring(0, ndx);
    //     }
    // }
    //
    // return '/';
}

__webpack_public_path__ = getScriptDir();
