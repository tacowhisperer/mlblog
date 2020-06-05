/**
 * @author tacowhisperer
 */

const jmapFactory = require('../json/jmap').jmapFactory;

/**
 * Creates an mlblog object that reads data on the mlblog database.
 * @param {sheetdbObject} sheetDb A sheet database object that is connected to the ml blog for reading its data.
 * @param {Array} blogContentOrder Array specifying the format of the blog content in the database.
 * @param {Array} userContentOrder Array specifying the format of the user content in the database.
 */
function mlblogFactory(sheetDb, blogContentOrder, userContentOrder) {
	return new mlblogObject(sheetDb, blogContentOrder, userContentOrder);
}

/**
 * The Mexico Lindo Blog Object. It connects to a blog database shaped like a spreadsheet, and returns the formatted
 * content in a JSON object for further processing.
 * @param {sheetdbObject} sheetDb A sheet database object that is connected to the ml blog for reading its data.
 * @param {Array} blogContentOrder Array specifying the format of the blog content in the database.
 * @param {Array} userContentOrder Array specifying the format of the user content in the database.
 */
function mlblogObject(sheetDb, blogContentOrder, userContentOrder) {
	const DB = sheetDb;
	
	// Used for mapping blog content to their respective JSON objects for further processing.
	const jmapBlog = jmapFactory().setCommAdapter({
		getFormat: () => Object.create({delim: '---', order: blogContentOrder}),
		getExtraKey: () => 'IMAGES'
	});

	// Used for mapping user content to their respective JSON objects for further processing.
	const jmapUser = jmapFactory().setCommAdapter({
		getFormat: () => Object.create({delim: null, order: userContentOrder}),
		getExtraKey: () => 'EXTRA'
	});


	/**
	 * Reads and parses the main blog content found in the blog at the Google Sheets database.
	 */
	this.blogContent = async function() {
		const rawBlogContent = await DB.readSheetColumns('src', 0, 0);
		const transBlogContent = DB.transposeArray(rawBlogContent)[0];

		return jmapBlog.format(transBlogContent);
	};

	/**
	 * Reads and parses the username content found in the blog at the Google Sheets database.
	 */
	this.usernameContent = async function() {
		const rawUserContent = await DB.readSheetRows('usrs', 0, 5);

		return jmapUser.map(rawUserContent);
	};
}

// Export the factory for access in other modules.
exports.mlblogFactory = mlblogFactory;
