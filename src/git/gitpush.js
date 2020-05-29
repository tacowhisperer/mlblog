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
	 * @param {function} callback Function called once the push to the git master repository is successful.
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
				const status = await git.commit(commAdapter.getCommitMessage());

				console.log('Status:', status);
			}
		} catch (err) {
			console.log('Error in simple-git:', err);
		}
	};
}

gitPushFactory('./src/git/gitpush.js').push();

// git.status((err, status) => {
// 	if (err) console.log('Error in simple-git:', err);

// 	else console.log(status);
// });
