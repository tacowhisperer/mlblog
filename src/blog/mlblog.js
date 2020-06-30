/**
 * @author tacowhisperer
 */

const Converter = require('showdown').Converter;
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
 * content in a JSON object for further processing. This object is implicitly treated as a Blog Object, which is not
 * implemented in its own module. Instead, a Blog Object is assumed to only contain asynchronous methods that take no
 * arguments and return data that can be processed through JSON.stringify and JSON.parse.
 * @param {sheetdbObject} sheetDb A sheet database object that is connected to the ml blog for reading its data.
 * @param {Object} blogContentOrder Single key object where the key is the identifier that is mapped to Array specifying
 *                                  the format of the blog content in the database.
 * @param {Object} userContentOrder Single key object where the key is the identifier that is mapped to Array specifying
 *                                  the format of the user content in the database.
 */
function mlblogObject(sheetDb, blogContentOrder, userContentOrder) {
	const DB = sheetDb;
	const MD = new Converter();

	const getMainKey = function(contentOrder) {
		const keys = Object.entries(contentOrder);

		if (keys.length === 1)
			return keys[0][0];

		throw `Error: Can't have more than 1 primary key in content mapping. Got ${keys.length} primary keys.`;
	};

	const B_KEY = getMainKey(blogContentOrder);
	const B_ORDER = blogContentOrder[B_KEY];

	const U_KEY = getMainKey(userContentOrder);
	const U_ORDER = userContentOrder[U_KEY];
	
	// Used for mapping blog content to their respective JSON objects for further processing.
	const jmapBlog = jmapFactory().setCommAdapter({
		getFormat: () => Object.create({delim: '---', order: B_ORDER}),
		getExtraKey: () => 'IMAGES'
	});

	// Used for mapping user content to their respective JSON objects for further processing.
	const jmapUser = jmapFactory().setCommAdapter({
		getFormat: () => Object.create({delim: null, order: U_ORDER}),
		getExtraKey: () => 'EXTRA'
	});


	/**
	 * Reads and parses the main blog content found in the blog at the Google Sheets database.
	 */
	async function getBlogContent() {
		const rawBlogContent = await DB.readSheetColumns('src', 0, 0);
		const transBlogContent = DB.transposeArray(rawBlogContent)[0];

		// Remove any blog entries that do not reach to the end of the order definition.
		return jmapBlog.format(transBlogContent).filter(data => data[B_ORDER[B_ORDER.length - 1]] !== undefined);
	};

	/**
	 * Takes the content obtained from the blogContent method, but instead returns content as markdown HTML instead
	 * of plaintext.
	 */
	this.blogContentHtml = async function() {
		const blogContent = await getBlogContent();

		return blogContent.map(entry => {
			entry[B_KEY] = MD.makeHtml(entry[B_KEY]);
			return entry;
		});
	};

	/**
	 * Reads and parses the username content found in the blog at the Google Sheets database.
	 */
	this.usernameContent = async function() {
		const rawUserContent = await DB.readSheetRows('usrs', 0, 5);

		return jmapUser.map(rawUserContent).reduce((users, user) => {
			const userData = Object.assign(Object.create({}), users);

			// Remove the primary key from the resulting output.
			if (user[U_KEY] !== 'Username') {
				userData[user[U_KEY]] = Object.create({});
				for (let prop in user) {
					if (prop != U_KEY)
						userData[user[U_KEY]][prop] = user[prop];
				}
			}

			return userData;
		}, Object.create({}));
	};
}

// Export the factory for access in other modules.
exports.mlblogFactory = mlblogFactory;
