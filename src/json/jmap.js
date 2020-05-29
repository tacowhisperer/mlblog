/**
 * Creates a new jmapObject that handles conversion of 1D delimited arrays into a 1D array of JSON object maps.
 */
function jmapFactory() {
	return new jmapObject();
}

/**
 * JSON Mapping Object. It maps an input 1D array of delimited elements into a 1D array of JSON object maps.
 */
function jmapObject() {
	// Communication adapter for receiving data from other modules.
	var commAdapter = {
		getFormat: () => Object.create({delim: null, order: []}),
		getExtraKey: () => 'JMAPEXTRA'
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
	 * Formats the input array into a 1D array of JSON objects.
	 * @param {Array} arr The input array of data that is formatted using the available format object from commAdapter.
	 * @return {Array} An array of JSON objects corresponding to the grouped elements of the input array.
	 */
	this.format = function(arr) {
		const FMT = commAdapter.getFormat();
		
		const DELIM = FMT.delim;
		const ORDER = FMT.order;

		// Group array elements into their delimiter-separated values
		const groups = [];
		groups.push(arr.reduce((group, val) => {
			if (val === DELIM) {
				groups.push(group);
				return [];
			}

			return group.concat([val]);
		}, []));

		// Convert the grouped arrays into their respective mapped objects
		return groups.map(group => {
			const map = {};

			let i = 0;
			for (; i < ORDER.length; i++)
				map[ORDER[i]] = group[i];

			// Push any remaining elements into the EXTRA_KEY array in the output map.
			if (i < group.length) {
				const EXTRA_KEY = commAdapter.getExtraKey();

				map[EXTRA_KEY] = [];
				for (; i < group.length; i++)
					map[EXTRA_KEY].push(group[i]);
			}

			return map;
		});
	};
}

// Export the factory for access in other modules.
exports.jmapFactory = jmapFactory;
