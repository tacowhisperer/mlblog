const fs = require('fs');

/**
 * Creates a new Watch Object that handles changes in the directory at the specified path.
 * @param {string} path The path to the file ordirectory to watch and call a handler on.
 * @param {number} delay The amount of time to keep a watched file from firing a second change event. Default 100 ms.
 */
function watchFactory(path, delay = 100) {
	return new watchObject(path, delay);
}

/**
 * Watch Object for attaching handlers to the specified directory.
 * @param {string} path The path to the file or directory to watch and call a handler on.
 * @param {number} delay The amount of time to keep a watched file from firing a second change event.
 */
function watchObject(path, delay) {
	const PATH = path;
	const DELAY = delay;

	// Stores the handlers to call on a directory change detection.
	const handlers = [];

	// Used to prevent multiple firings from the same directory.
	let watched = false;

	fs.watch(PATH, (eventType, fileName) => {
		if (!watched) {
			watched = true;

			for (let i = 0; i < handlers.length; i++)
				handlers[i](eventType, fileName);

			// Release the file after DELAY ms.
			setTimeout(() => {watched = false;}, DELAY);
		}
	});

	/**
	 * Removes all handlers from the handlers array.
	 */
	this.clear = function() {
		while (handlers.length > 0)
			handlers.pop();

		return this;
	};

	/**
	 * Attaches a handler to be executed on a directory change.
	 * @param {function} handler A two-parameter function (eventType, fileName) that gets called on a directory change.
	 */
	this.attach = function(handler) {
		handlers.push(handler);

		return this;
	};
}

// Export the factory for access in other modules.
exports.watchFactory = watchFactory;
