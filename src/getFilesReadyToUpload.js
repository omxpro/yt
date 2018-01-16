const fs = require('fs');

module.exports = function getFilesReadyToUpload(path) {
	const now = Date.now();
	const files = [];
	const timeout = 180000;

	fs.readdirSync(path).forEach(file => {
		const mtime = fs.statSync(dir + '/' + file).mtime.getTime();
		if (mtime > (now + timeout)) {
			files.push(file);
		}
	});

	return files;
};
