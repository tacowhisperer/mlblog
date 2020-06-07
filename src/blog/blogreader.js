/**
 * @author tacowhisperer
 */

const engine = require('../engine/engine').engineFactory;

/**
 * Creates a blogreaderObject that is used to poll the latest data from the provided blog object.
 * @param {blogObject} blog A Blog object to poll data from.
 * @param {Function} fn The function called with the latest blog data.
 * @param {number} rate The number of ms between polls. Defaults to 30000 (30 seconds).
 */
function blogreaderFactory(blog, path, rate = 30000) {
	return new blogreaderObject(blog, path, rate);
}

/**
 * Blog Reader Object. Asynchronously polls the provided blog object and stores the data to the provided path.
 * @param {blogObject} blog A Blog object to poll data from.
 * @param {Function} fn The function called with the latest blog data.
 * @param {number} rate The number of ms between polls. Defaults to 30000 (30 seconds).
 */
function blogreaderObject(blog, fn, rate = 30000) {
	const BLOG = blog;
	const FUNC = fn;

	// Hold the last obtained data from storage to prevent writing to storage too much.
	const LAST_DATA = Object.create({});
	for (let dbpage in BLOG)
		LAST_DATA[dbpage] = null;

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

		// Call the handler function when there is an update to the blog data.
		if (update) {
			const data = Object.create({});
			data[blog.constructor.name] = expand();
			
			FUNC(data);
		}
	});

	// Stores data to the LAST_DATA object in a way that allows for easy content comparison.
	function cache(dbpage, newData) {
		LAST_DATA[dbpage] = JSON.stringify(newData);
	}

	// Checks for equivalence between blog page data.
	function equivalent(dbpage, newData) {
		return LAST_DATA[dbpage] === JSON.stringify(newData);
	}

	// Converts data stored in LAST_DATA back to their object form.
	function expand() {
		const L_DATA = Object.create({});
		for (let dbpage in LAST_DATA)
			L_DATA[dbpage] = JSON.parse(LAST_DATA[dbpage]);

		return L_DATA;
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
