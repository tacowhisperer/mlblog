/**
 * @author tacowhisperer
 */

const googledb = require('./../google/db/googledb').googledbFactory;
const mlblog = require('./../blog/mlblog').mlblogFactory;
const blogreader = require('./../blog/blogreader').blogreaderFactory;

/**
 * Factory of the main controller for the reader for the Mexico Lindo Blog.
 * @param {Function} fn The function to execute on new Mexico Lindo Blog data.
 */
function readerFactory(fn = data => console.log(data)) {
	return new readerObject(fn);
}

/**
 * Main controller of the Mexico Lindo Blog poll object.
 * @param {Function} fn The function to execute on new Mexico Lindo Blog data.
 */
function readerObject(fn) {
	// The file token.json stores the user's access and refresh tokens, and is created automatically when the
	// authorization flow completes for the first time.
	const TOKEN_PATH = './google_auth/token.json';

	// The directory that holds the credentials to use for the app
	const CREDENTIALS_PATH = './google_auth/credentials.json';

	// The ID of the sheet that holds the data
	const SHEET_ID = '1PvfOnhC4a0W5Vsop7hk3DFaq_hO9ZOp1bGbMc9cgkco';

	// Data format as it's stored in the Google Sheet.
	const BLOG_FMT = {content: ['date', 'username', 'title', 'link', 'content']};
	const USR_FMT = {username: ['username', 'display', 'ppic', 'bio', 'link', 'bday']};

	// Poller for the blog
	const reader = blogreader(mlblog(googledb(CREDENTIALS_PATH, TOKEN_PATH, SHEET_ID), BLOG_FMT, USR_FMT), fn);

	// Map the start and stop functions directly to the reader
	this.start = reader.start;
	this.stop = reader.stop;
}

// Export the factory for access in other modules.
exports.readerFactory = readerFactory;
