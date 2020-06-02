/**
 * @author tacowhisperer
 */

const sheets = require('googleapis').google.sheets;

/**
 * @author tacowhisperer
 */

/**
 * Creates a new googleSheetsObject that handles spreadsheet data reading.
 * @param {string} sheetId The ID value of the sheet to be read.
 */
function googleSheetsFactory(sheetId) {
	return new googleSheetsObject(sheetId);
}

/**
 * Google Sheets Object. It reads data off a Google Sheets spreadsheet given the correct access objects.
 * @param {string} sheetId The ID value of the sheet to be read.
 */
function googleSheetsObject(sheetId) {
	const SHEET_ID = sheetId;

	// Communication adapter for receiving data from other modules.
	var commAdapter = {
		getAuth: () => Object.create({})
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
	 * Reads the data at the specified data range.
	 * @param {string} dataRange The range (A1 notation) of data to be read from the specified sheet.
	 * @returns {Promise} The Promise of the data read from the specified range.
	 */
	this.read = async function(dataRange) {
		return await sheets(commAdapter.getAuth()).spreadsheets.values.get({
			spreadsheetId: SHEET_ID,
			range: dataRange
		});
	};
}

// Export the factory for access in other modules.
exports.googleSheetsFactory = googleSheetsFactory;
