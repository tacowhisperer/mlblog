/**
 * Creates a new jmapObject that handles conversion of arrays into JSON objects that can be exported.
 */
function jmapFactory() {
	return new jmapObject();
}

/**
 * JSON Mapping Object. It maps an input array of elements into a JSON object that can be exported.
 */
function jmapObject() {
	// Communication adapter for receiving data from other modules.
	var commAdapter = {
		getFormat: () => Object.create({delim: null, order: [], enum: {}})
	};

	/**
	 * Sets the internal communication adapter to the one provided. If the required properties are not
	 * found in the new adapter, the adapter is rejected and an error message is printed. The old adapter
	 * is not removed.
	 * @param {Object} newCommAdapter The new communication adapter to replace the old one with.
	 */
	this.setCommAdapter = function(newCommAdapter) {
		let ok = true;
		for (let comm in commAdapter) {
			if (!newCommAdapter.hasOwnProperty(comm) || (typeof newCommAdapter[comm]) !== (typeof commAdapter[comm])) {
				ok = comm;
				break;
			}
		}

		if (ok === true)
			commAdapter = newCommAdapter;
		else
			console.error(`New communication adapter has invalid property "${ok}"`);
		
		return this;
	};

	/**
	 * Formats the input array into a JSON object that is returned.
	 * @param {array} arr The input array of data that is formatted using the available format object from commAdapter.
	 */
	this.format = function(arr) {
		const FMT = commAdapter.getFormat();
		
		const DELIM = FMT.delim;
		const ORDER = FMT.order;
		const ENUM = FMT.enum;

		// TODO: Finish this function.
	};
}

// Export the factory for access in other modules.
exports.jmapFactory = jmapFactory;
