/**
 * @author tacowhisperer
 */

const fs = require('fs');

const watch = require('./src/dir/watch').watchFactory;
const reader = require('./src/app/reader').readerFactory;
const gitpush = require('./src/git/gitpush').gitPushFactory;

/**
 * Main controller of the Mexico Lindo Blog backend. It assembles all of the modules in the app directory
 */
function app() {
	// Path to the directory that holds web assets
	const WEB_DIR = './www';
	
	// Make the folder that will hold the blog data if it does not exist
	try {
		fs.mkdirSync(WEB_DIR);
	} catch (err) {
		if (err.code !== 'EEXIST') {
			console.error('Error creating directory that holds web assets:', err);
			return process.exit(-1);
		}
	}

	// Blog data
	const BLOG_OBJ = 'mlblogObject';

	// File name that holds blog data
	const BLOG_FILE = `${BLOG_OBJ}.json`;

	// Final path string
	const BLOG_DATA_PATH = `${WEB_DIR}/${BLOG_FILE}`;

	// Server confirmation of final blog data path.
	log(`Set final blog data path: ${BLOG_DATA_PATH}`);

	// Initialize the blog reader
	const mlreader = reader(data => fs.writeFile(BLOG_DATA_PATH,
		(function() {
			try {
				return JSON.stringify(data[BLOG_OBJ], null, 8);
			} catch (err) {
				console.error('Error parsing blog data:', err);
				return '{}';
			}
		})(), err => {
			if (err) {
				console.error('Error writing data to file:', err);
				try {
					console.log(JSON.stringify(data[BLOG_OBJ], null, 8));
				} catch (e) {
					console.error('Error parsing blog data:', e);
				}

				return;
			}

			log(`${BLOG_FILE} successfully saved to disk.`);
		})
	).start();

	// Initialize the file watcher
	const comm = {
		getGitHomePath: () => './',
		getCommitMessage: () => {
			const msg = `Updated ${BLOG_FILE} data from database.`;
			log(msg);

			return `${new Date()}: ${msg}`;
		}
	};

	const mlwatch = watch(WEB_DIR).attach((eventType, fileName) => {
		if (fileName === BLOG_FILE && eventType === 'change') {
			gitpush(BLOG_DATA_PATH).setCommAdapter(comm).push(err => {
				if (err)
					console.error('Error pushing data to GitHub:', err);
				else
					log(`No changes detected to "${BLOG_FILE}"`);
			});
		}
	});

	/**
	 * Attach a timestamp to the log to know when a message was generated.
	 */
	function log(msg) {
		console.log(`${new Date()}: ${msg}`);
	}
}

// Build and start the main application.
app();
