/**
 * @author tacowhisperer
 */

/**
 * Creates a new Sheet DB Object used to navigate a database shaped like a spreadsheet.
 */
function sheetdbFactory() {
	return new sheetdbObject();
}

/**
 * Sheet DB Object. Used to interface between a specific Sheet database implementation and a different, non-related
 * module. It aids navigating a database shaped like a spreadsheet.
 */
function sheetdbObject() {
	// Communication adapter for receiving data from other modules.
	var commAdapter = {
		getSheetObject: () => Object.create({}),
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

	/**
	 * Reads the rows of the sheet provided by the adapter at the specified row index range.
	 * @param {string} page The page name of the sheet to read.
	 * @param {number} from The index of the starting row to read.
	 * @param {number} to The index of the ending row to read (non-inclusive).
	 * @returns {Promise} The data obtained from the sheet.
	 */
	this.readSheetRows = async function(page, from, to) {
		return await this.readSquare(page, from, to, 0, Infinity);
	};

	/**
	 * Reads the columns of the sheet provided by the adapter at the specified colunm index range.
	 * @param {string} page The page name of the sheet to read.
	 * @param {number} from The index of the starting column to read.
	 * @param {number} to The index of the ending column to read (non-inclusive).
	 * @returns {Promise} The data obtained from the sheet.
	 */
	this.readSheetColumns = async function(page, from, to) {
		return await this.readSquare(page, 0, Infinity, from, to);
	};

	/**
	 * Reads the data of the sheet provided by the adapter at the specified row/column index range.
	 * @param {string} page The page name of the sheet to read.
	 * @param {number} fromX The index of the starting row to read.
	 * @param {number} toX The index of the ending row to read (non-inclusive).
	 * @param {number} fromY The index of the starting column to read.
	 * @param {number} toY The index of the ending column to read (non-inclusive).
	 * @returns {Promise} The data obtained from the sheet.
	 */
	this.readSquare = async function(page, fromX, toX, fromY, toY) {
		return commAdapter.getSheetContent(commAdapter.getSheetObject(), page, fromX, toX, fromY, toY);
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
