/**
 * @author tacowhisperer
 */

const fs = require('fs');
const engine = require('../engine/engine').engineFactory;

/**
 * Creates a blogreaderObject that is used to store the data available at the mlblog to storage.
 * @param {mlblogObject} mlblog The Mexico Lindo Blog object to poll data from.
 * @param {string} path The path to where the data should be stored.
 * @param {number} rate The number of ms between polls. Defaults to 30000.
 */
function blogreaderFactory(mlblog, path, rate = 30000) {
	return new blogreaderObject(mlblog, path, rate);
}

/**
 * Blog Reader Object. Asynchronously polls the provided blog object and stores the data to the provided path.
 * @param {mlblogObject} blog The Blog object to poll data from.
 * @param {string} path The path to where the data should be stored.
 * @param {number} rate The number of ms between polls. Defaults to 30000.
 */
function blogreaderObject(blog, path, rate = 30000) {
	const BLOG = blog;
	const PATH = path;

	// Polls the blog for data.
	const rEngine = engine(rate).add(async () => {
		let update = false;

		// Check all pages of the blog for data changes.
		for (let dbpage in BLOG) {
			try {
				const newData = await BLOG[dbpage]();

				// Initiate the update sequence if the new data has different data than what's already stored.
				if (!equivalent(dbpage, newData)) {
					cache(dbpage, newData);
					update = true;
				}
			} catch (err) {
				console.error(`Error reading ${blog.constructor.name}.${dbpage}:`, err);
			}
		}

		// TODO: Finish fs submodule
		if (update)
			console.log(LAST_DATA);
	});

	// Hold the last obtained data from storage to prevent writing to storage too much.
	const LAST_DATA = Object.create({});
	for (let dbpage in BLOG)
		LAST_DATA[dbpage] = null;

	// Stores data to the LAST_DATA object in a way that allows for easy content comparison.
	function cache(dbpage, newData) {
		LAST_DATA[dbpage] = JSON.stringify(newData);
	}

	// Checks for equivalence between blog page data.
	function equivalent(dbpage, newData) {
		return LAST_DATA[dbpage] === JSON.stringify(newData);
	}

	// Starts the blog polling and storage process.
	this.start = function() {
		rEngine.start();
	};

	// Stops the engine.
	this.stop = function() {
		rEngine.stop();
	};
}

// Export the factory for access in other modules.
exports.blogreaderFactory = blogreaderFactory;
