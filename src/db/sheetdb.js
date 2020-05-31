/**
 * Creates a new Sheet DB Object used to navigate a database shaped like a spreadsheet.
 */
function sheetdbFactory() {
	return new sheetdbObject();
}

/**
 * 
 */
function sheetdbObject() {
	// Communication adapter for receiving data from other modules.
	var commAdapter = {
		getSheetObject: () => Object.create({}),
		getPageHeight: () => 0,
		getPageWidth: () => 0,
		getSheetContent: (sheetObject, page, fromX, toX, fromY, toY) => []
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

	this.readSheetRows = async function(page, from, to) {
		const a = commAdapter;
		return a.getSheetContent(a.getSheetObject(), page, from, to, 0, a.getPageWidth());
	};

	this.readSheetColumns = async function(page, from, to) {
		const a = commAdapter;
		return a.getSheetContent(a.getSheetObject(), page, 0, a.getPageHeight(), from, to);
	};

	this.readSquare = async function(page, fromX, toX, fromY, toY) {
		return 
	};

	/**
	 * Transposes the input array.
	 * @param {Array} arr The array to transpose.
	 * @return {Array} The input array, but transposed.
	 */
	this.transposeArray = function(arr) {
		if (arr.length == 0)
			return [];

		const trans = [];

		for (let i = 0; i < arr[0].length; i++) {
			const row = [];
			for (let j = 0; j < arr.length; j++)
				row.push(arr[j][i]);

			trans.push(row);
		}

		return trans;
	};
}

// Export the factory for access in other modules.
exports.sheetdbFactory = sheetdbFactory;
