/**
 * Mexico Lindo Blog main controller.
 * 
 * @author tacowhisperer
 */
const jmapFactory = require('../json/jmap').jmapFactory;
const googleAuthFactory = require('../google/auth/googleauth').googleAuthFactory;
const googleSheetsFactory = require('../google/sheets/googlesheets').googleSheetsFactory;

/**
 * Creates an mlblog object that 
 */
function mlblogFactory() {
	return new mlblogObject();
}

function mlblogObject() {
	// Communication adapter for receiving data from other modules.
	var commAdapter = {
		getSheetId: () => '',
		getCredentialsPath: () => '',
		getTokenPath: () => ''
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
	 * Reads and parses the main blog content found in the blog at the Google Sheets database.
	 */
	this.blogContent = function(handler) {
		
	};

	/**
	 * Reads and parses the username content found in the blog at the Google Sheets database.
	 */
	this.usernameContent = function(handler) {

	};
}