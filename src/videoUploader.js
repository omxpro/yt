const storage = require('node-persist');
const fs = require('fs');
const Youtube = require('youtube-api');

let isUploadInProgress = false;
let error = null;

storage.initSync();

function getUploadedVideos() {
	const uploadedVideos = storage.getItemSync('uploadedVideos');
	return uploadedVideos ? uploadedVideos : [];
}

function addUploadedVideo(file) {
	storage.setItemSync('uploadedVideos', [
		...getUploadedVideos(),
		file
	]);
}

function removeUploadedVideo(file) {
	const uploadedVideos = getUploadedVideos();

	if (uploadedVideos.indexOf(file) === -1) {
		return;
	}

	storage.setItemSync(
		'uploadedVideos',
		uploadedVideos.splice(uploadedVideos.indexOf(file), 1)
	);
}

module.exports.uploadVideo = function(file, info) {
	isUploadInProgress = true;

	const videoData = {
		resource : {
			snippet : {
				title       : info.title,
				description : info.description,
				tags        : info.tags
			},
			status : {
				privacyStatus : 'private'
			}
		},
		part  : 'snippet,status',
		media : {
			body : fs.createReadStream('./videos/' + file)
		}
	};

	request = Youtube.videos.insert(videoData, (err, data) => {
		isUploadInProgress = false;

		if (err) {
			console.log('ERROR', file, err);
			error = err;
		}
		else {
			console.log('SUCCESS', file, data);
			addUploadedVideo(file);
		}
	});

	return request;
};

module.exports.getError = function() {
	return error;
}

module.exports.isUploadInProgress = function() {
	return isUploadInProgress;
}

module.exports.getUploadStatus = function(request) {
	return request.req.connection._bytesDispatched;
};

module.exports.getUploadedVideos = getUploadedVideos;
module.exports.removeUploadedVideo = removeUploadedVideo;
