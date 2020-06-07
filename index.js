/**
 * @author tacowhisperer
 */

const watch = require('./src/dir/watch').watchFactory;
const reader = require('./src/app/reader').readerFactory;

/**
 * Main controller of the Mexico Lindo Blog backend. It assembles all of the modules in the app directory
 */
function app() {
	reader(data => console.log(data.mlblogObject)).start();
}

// Build and start the main application.
app();
