/**
 * @author tacowhisperer
 */

/**
 * Code adapted from http://ccoenraets.github.io/es6-tutorial-data/promisify/
 * Converts the callback-based XHR native functionality into a Promise-based operation.
 * @param {Object} params Object detailing arguments to feed to the XHR object.
 * @returns {Promise} The Promise of the result of the request.
 */
function xhrRequest(params) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		// Open a request using the specified method
		xhr.open(params.method || 'GET', params.url);

		// Set the request headers to the ones provided, if any.
		if (params.headers)
			Object.keys(params.headers).forEach(key => xhr.setRequestHeader(key, params.headers[key]));

		// Override the load sequence to handle the resolution of this Promise
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300)
				resolve(xhr.response);
			else
				reject(xhr.statusText);
		};

		// Override the error sequence to handle the rejection of this Promise
		xhr.onerror = () => reject(xhr.statusText);

		// Send the request
		xhr.send(params.body);
	});
}

/**
 * Sends a simple GET request to the specified URL.
 * @param {string} url The URL to send the GET request to.
 * @returns {Promise} The Promise of the result of the GET request.
 */
async function getRequest(url) {
	try {
		return await xhrRequest({url: url, method: 'GET'});
	} catch (err) {
		console.error(`GET Request Error for "${url}":`, err);
		return '';
	}
}
