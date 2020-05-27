const fs = require('fs');
const readlineSync = require('readline-sync');
const {google} = require('googleapis');

/**
 * Creates a new googleauth object that handles authentication with Google's API for Sheets.
 * @param {string} credentialsPath The path to the credentials.json file to use for authenticating with Google servers.
 * @param {string} tokenPath The path to the token.json file that stores authentication data for faster authorization.
 */
function googleAuthFactory(credentialsPath, tokenPath) {
	return new googleAuthObject(credentialsPath, tokenPath);
}

/**
 * Google Authentication Object. It handles authentication with Google's API for Sheets, and other token management.
 * @param {string} credentialsPath The path to the file containing the credentials object to use for authentication.
 * @param {string} tokenPath The path to where the generated authentication token should be stored.
 */
function googleAuthObject(credentialsPath, tokenPath) {
	const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

	const CREDS_PATH = credentialsPath;
	const TOKEN_PATH = tokenPath;

	// Active OAuth2Client Promise Object
	var oAuth2Client = {
		setCredentials: () => {},
		generateAuthUrl: () => 'https://developers.google.com/sheets/api/quickstart/nodejs',
		getToken: (code, callback) => callback('Cannot get token from default authentication object.')
	};

	// Currently resolving token Promise Object
	var resolvingToken = Promise.resolve({});

	/**
	 * Obtains an old authorization token if it exists, or generates a new one if unavailable.
	 * @param {Object} auth2Client oAuth2Client object created by the google.auth.OAuth2 API.
	 * @return {Object} token The authorization token object to be set to the active oAuth2Client object.
	 */
	async function getNewToken(auth2Client) {
		const authUrl = auth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES
		});

		console.log('Authorize this app by visiting this url:', authUrl);


		// Use the Google API to gain authorization.
		const code = readlineSync.question('Enter the code from that page here: ');
		try {
			const {tokens} = await auth2Client.getToken(code);

			// Store the newly obtained token to disk.
			fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
				if (err) return console.error(err);

				console.log('Token stored to', TOKEN_PATH);
			});

			console.log(`Token: ${JSON.stringify(tokens, null, 4)}`);

			return tokens
		} catch (err) {
			console.error('Error while trying to retrieve access token', err);
			return {};
		}
	}

	/**
	 * Function for generating the OAuth2Client object for active use.
	 */
	this.authenticate = function() {
		let credentials = {}

		try {
			credentials = JSON.parse(fs.readFileSync(CREDS_PATH));
		} catch (err) {
			console.error('Error obtaining credentials for authentication:', err);
			return this;
		}

		const {client_secret, client_id, redirect_uris} = credentials.installed;
		const newAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

		// Check if there was a token previously stored. Otherwise, generate a new one.
		try {
			resolvingToken = Promise.resolve(JSON.parse(fs.readFileSync(TOKEN_PATH)));
		} catch (err) {
			resolvingToken = getNewToken(newAuth2Client);
		}

		// Set the authorization token to the new OAuth2Client
		resolvingToken.then(tokenValue => newAuth2Client.setCredentials(tokenValue));

		// Activate the new OAuth2Client
		oAuth2Client = newAuth2Client;

		return this;
	};

	/**
	 * Gives the provided function access to the Promise oAuth2Client object.
	 * @param {function} accessor Single argument function that uses the resolved Google Sheets v4 API auth object.
	 */
	this.authorize = function(accessor) {
		resolvingToken.then(x => accessor({version: 'v4', auth: oAuth2Client}));
		return this;
	};
}

// Export the factory for access in other modules.
exports.googleAuthFactory = googleAuthFactory;
