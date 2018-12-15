/**
 * Simple AJAX support without jQuery or other massive libraries
 * @constructor
 */
export const Ajax = function() {
}

Ajax.do = function(obj) {
	const request = new XMLHttpRequest();
	request.open(obj.method, obj.url, true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			obj.success(request.responseText);
		} else {
			// We reached our target server, but it returned an error
			obj.error(request.xhr, request.statusText, 'invalid URL');
		}
	};

	request.onerror = function() {
		// There was a connection error of some sort
		obj.error(request.xhr, request.statusText, 'server not found');
	};

	request.send();
}