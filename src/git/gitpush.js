/**
 * @author tacowhisperer
 */

const path = require('path');

/**
 * Creates a new git push object that automatically handles pushing all changes to git.
 * @param {string} filePath The path to the file to keep track of.
 */
function gitPushFactory(filePath) {
	return new gitPushObject(filePath);
}

/**
 * Git Push Object. Automatically interfaces with an installed git binary to push all detected changes to the specified
 * file up to the master repository.
 * @param {string} filePath The path to the file to keep track
 */
function gitPushObject(filePath) {
	const PATH = path.normalize(filePath);

	// Communication adapter for receiving data from other modules.
	var commAdapter = {
		getGitHomePath: () => '../../',
		getCommitMessage: () => `${new Date()}: Auto-commit ${PATH}`
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
	 * Pushes the watched file to the git master repository if changes are detected.
	 * @param {function} callback Function called once git binaries have executed. On error, 1st argument is non-null.
	 */
	this.push = async function(callback) {
		const git = require('simple-git/promise')(commAdapter.getGitHomePath());

		try {
			const gitStatus = await git.status();
			const {modified} = gitStatus;

			// Normalize the paths obtained to give the file path a fair comparison baseline.
			const modnorm = modified.map(p => path.normalize(p));

			let modded = false;
			for (let i = 0; i < modnorm.length; i++) {
				if (modnorm[i] === PATH) {
					modded = true;
					break;
				}
			}

			// The file we are watching is modified, so push the changes to the master repository.
			if (modded) {			
				await git.add('.' + path.sep + PATH);
				log(`Successfully added ${'.' + path.sep + PATH}`);

				await git.commit(commAdapter.getCommitMessage());
				log(`Successfully committed ${'.' + path.sep + PATH}`);

				await git.push('origin', 'master');
				log(`Successfully pushed ${'.' + path.sep + PATH} to origin master`);
			}

			callback(null);
		} catch (err) {
			callback(err);
		}
	};

	/**
	 * Attach a timestamp to the log to know when a message was generated.
	 */
	function log(msg) {
		console.log(`${new Date()}: ${msg}`);
	}
}

// Export the factory for access in other modules.
exports.gitPushFactory = gitPushFactory;
