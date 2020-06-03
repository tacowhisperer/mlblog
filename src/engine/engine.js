/**
 * @author tacowhisperer
 */

/**
 * Creates an engineObject that can be used to execute added function a specified number of times.
 * @param {number} interval The number of milliseconds between function calls.
 * @param {number} reps The number of times that each function should be called. Default to Infinity.
 */
function engineFactory(interval, reps = Infinity) {
	return new engineObject(interval, reps);
}

/**
 * Engine Object. It streamlines the setInterval function to more easily start, stop, and add function calls that
 * get called periodically after a fixed amount of time has passed.
 * @param {number} interval The number of milliseconds between function calls.
 * @param {number} reps The number of times that each function should be called. Default to Infinity.
 */
function engineObject(interval, reps = Infinity) {
	const INTERVAL = interval;
	const REPS = reps;

	// Holds the ID value of the event loop currently executing.
	let eventLoop = 0;

	// Holds the HANDLER_OBJ function objects that execute every INTERVAL milliseconds.
	const handlers = [];

	// Simplifies what goes into the handlers array.
	const HANDLER_OBJ = (fn, args = []) => {
		const FUNC = fn;
		const ARGS = args;

		return {call: () => FUNC.apply(FUNC, ARGS), rep: 0};
	}

	// Generates a new event loop to execute the function handlers every INTERVAL milliseconds.
	const EVENT_LOOP = () => {
		return setInterval(() => {

			for (let i = 0; i < handlers.length; i++) {
				if (handlers[i].rep < REPS) {
					handlers[i].call();
					handlers[i].reps++;
				}
			}

		}, INTERVAL);
	};

	/**
	 * Start engine execution.
	 */
	this.start = function() {
		if (eventLoop !== 0)
			eventLoop = EVENT_LOOP();

		return this;
	};

	/**
	 * Terminate engine execution.
	 */
	this.stop = function() {
		if (eventLoop === 0)
			eventLoop = clearInterval(eventLoop) || 0;

		return this;
	};

	/**
	 * Adds a new function that is called by the engine.
	 * @param {function} fn The function to be periodically called by the engine.
	 * @param {Array} args The arguments to pass to the function on each call. Defaults to no arguments, ([]).
	 */
	this.add = function(fn, args = []) {
		handlers.push(HANDLER_OBJ(fn, args));

		return this;
	}
}

// Export the factory for access in other modules.
exports.engineFactory = engineFactory;
