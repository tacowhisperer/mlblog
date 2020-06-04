/**
 * @author tacowhisperer
 */

const wf = require('./src/dir/watch').watchFactory;
const googledb = require('./src/google/db/googledb').googledbFactory;

/**
 * Main controller of the Blog application. It combines the Google Sheets API with the Git directory repository
 * watcher to automatically allow a third party website access to the sheet content in a data-friendly format.
 * @param {function} googleModelFactory Factory function that creates a Google Model object.
 * @param {function} gitModelFactory Factory function that creates a Git Model object.
 */
function controller(googleModelFactory, gitModelFactory) {
	// Make a new Google Sheets model object 
	const sheetsModel = googleModelFactory();

	// Make a new Git model object
	const gitModel = gitModelFactory();

	// Link the Google Sheets model with the Git model using their respective adapters.
	sheetsModel.setCommAdapter({

	});

	gitModel.setCommAdapter({

	});

	// Allow external access to the controller via the interface object below.
	return {
		start: () => {
			gitModel.start();
			sheetsModel.start();
		}
	};
}

// Build and start the main application.
controller(
	() => {
		const wo = wf('./');

		wo.attach((eventType, fileName) => {
			console.log(`${eventType}: "${fileName}" experienced change!`);
		});
		
		return {
			setCommAdapter: () => {},
			start: () => console.log('Google Model.start()')
		};
	}, () => {
		return {
			setCommAdapter: () => {},
			start: () => console.log('Git Model.start()')
		};
	}).start();


// The file token.json stores the user's access and refresh tokens, and is created automatically when the authorization
// flow completes for the first time.
const TOKEN_PATH = './token.json';

// The directory that holds the credentials to use for the app
const CREDENTIALS_PATH = './google_auth/credentials.json';

// The ID of the sheet that holds the data
const SHEET_ID = '1PvfOnhC4a0W5Vsop7hk3DFaq_hO9ZOp1bGbMc9cgkco';

// Example use case from the Quickstart guide.
googledb(CREDENTIALS_PATH, TOKEN_PATH, SHEET_ID).readSheetColumns('src', 0, 0).then(res => {
	const rows = res.data.values;
		if (rows.length) {
			console.log('Blog Data:');

			// Print columns A and E, which correspond to indices 0 and 4.
			rows.map((row) => {
				console.log(`${row[0]}`);
			});
		} else {
			console.log('No data found.');
		}
	}, err => console.log('The API returned an error: ' + err)
);
