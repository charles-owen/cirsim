/**
 * Set the Webpack public path so it knows where to load
 * CSS and images relative to. This must be imported before any other
 * imports.
 */

function getScriptDir() {
    let re = /^(http.*\/.*\/)[^\/]+.js.*$/;
    let result = document.currentScript.src.match(re);
    if(result !== null) {
        return result[1];
    }

    // If this fails we are likely running on a local
    // file system, so find the path from that.
    re = /^.*\/([^\/]+.js)$/;
    result = document.currentScript.src.match(re);
    if(result !== null) {
        const javascriptFile = result[1];

        var scriptElements = document.getElementsByTagName('script');
        for (var i = 0; i < scriptElements.length; i++) {
            var source = scriptElements[i].getAttribute("src");
            var ndx = source.indexOf(javascriptFile);
            if (ndx > -1) {
                return source.substring(0, ndx);
            }
        }
    }

    return '';
}

__webpack_public_path__ = getScriptDir();
