/**
 * Simple AJAX support without jQuery or other massive libraries
 * @constructor
 */
export const Ajax = function() {
}

Ajax.do = function(obj) {
	const request = new XMLHttpRequest();
	if(obj.method === 'GET') {
		let data = [];
		for(let key in obj.data) {
			if(!obj.data.hasOwnProperty(key)) {
				continue;
			}

			data.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj.data[key]));
		}

		request.open('GET', obj.url + '?' + data.join('&'), true);
	} else {
		request.open(obj.method, obj.url, true);
	}

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			if(obj.dataType === 'json') {
				try {
					obj.success(JSON.parse(request.responseText));
				} catch(ex) {
					console.log(ex);
					console.log(request.responseText);
				}

			} else {
				obj.success(request.responseText);
			}
		} else {
			// We reached our target server, but it returned an error
			obj.error(request.xhr, request.statusText, 'invalid URL');
		}
	};

	request.onerror = function() {
		// There was a connection error of some sort
		obj.error(request.xhr, request.statusText, 'server not found');
	};

	if(obj.method === 'POST') {
		if(obj.contentType === 'application/json') {
			request.setRequestHeader('Content-Type', 'application/json');
			request.send(JSON.stringify(obj.data));
		} else {
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

			let formData = [];
			for(let key in obj.data) {
				if(!obj.data.hasOwnProperty(key)) {
					continue;
				}

				formData.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj.data[key]));
			}

			request.send(formData.join('&'));
		}
	} else {
		request.send();
	}
}