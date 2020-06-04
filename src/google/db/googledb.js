/**
 * @author tacowhisperer
 */

const toA1 = require('./../../a1/a1').toA1;
const sheetdbObject = require('./../../db/sheetdb').sheetdbObject;
const googleAuthFactory = require('./../auth/googleauth').googleAuthFactory;
const googleSheetsFactory = require('./../sheets/googlesheets').googleSheetsFactory;

/**
 * Factory of the Google Database Object.
 * @param {string} tokenPath The path to where the authentication token is stored/read from.
 * @param {string} credsPath The path to where the credentials for identifying with Google are stored/read from.
 * @param {string} sheetId The ID value of the Google Sheet that holds the database information.
 */
function googledbFactory(credsPath, tokenPath, sheetId) {
	return new googledbObject(credsPath, tokenPath, sheetId);
}

/**
 * Google Database Object. Creates a new database object that reads data from a google sheets database.
 * @param {string} tokenPath The path to where the authentication token is stored/read from.
 * @param {string} credsPath The path to where the credentials for identifying with Google are stored/read from.
 * @param {string} sheetId The ID value of the Google Sheet that holds the database information.
 */
function googledbObject(credsPath, tokenPath, sheetId) {
	// Inherit the methods from sheetdbObject.
	sheetdbObject.call(this);

	// Initialize the Google Auth and Google Sheets connections.
	const googleAuth = googleAuthFactory(credsPath, tokenPath).authenticate();
	const googleSheets = googleSheetsFactory(sheetId);

	// Set the adapter to get data using the Google Sheets API.
	this.setCommAdapter({
		getSheetObject: () => googleSheets,
		getSheetContent: async (sheetdb, page, fromX, toX, fromY, toY) => {
			// Properly order the from/to x/y coordinates.
			const FROM_X = Math.min(fromX, toX);
			const TO_X = Math.max(fromX, toX);
			const FROM_Y = Math.min(fromY, toY);
			const TO_Y = Math.max(fromY, toY);

			// Build the range of queried data in A1 notation.
			const TO_RANGE = fromX == toX && fromY == toY ? '' : `:${toA1(TO_Y, TO_X)}`;
			const dataRange = `${toA1(FROM_Y, FROM_X, page)}${TO_RANGE}`;

			// Authenticate and read the data from the sheet using the Google API.
			const creds = await googleAuth.authorize();
			return await googleSheets.setCommAdapter({getAuth: () => creds}).read(dataRange);
		}
	});
}

// Export the factory for access in other modules.
exports.googledbFactory = googledbFactory;
