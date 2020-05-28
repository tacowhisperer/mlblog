const git = require('simple-git/promise')();

/**
 * Creates a new git push object that automatically handles pushing all changes to git.
 */
function gitPushFactory() {
	return new gitPushObject();
}

/**
 * Git Push Object. Automatically interfaces with an installed git binary to push all detected changes to the repo.
 */
function gitPushObject() {
	
}

git.status((err, status) => {
	if (err) console.log('Error in simple-git:', err);

	else console.log(status);
});
