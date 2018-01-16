const getFilesReadyToUpload = require('./getFilesReadyToUpload');
const uploadVideo = require('./uploadVideo');
const getUploadedFiles = require('./getUploadedFiles');
const parseVideoInfoFromFileName = require('./parseVideoInfoFromFileName');
const R = require('ramda');
const storage = require('node-persist');
const express = require('express');
const VIDEOS_DIR = './videos';
const app = express();

storage.initSync();

app.get('/uploaded-files', (req, res) => res.json(getUploadedFiles()));
app.get('/ready-to-upload', (req, res) => res.json(getFilesReadyToUpload(VIDEOS_DIR)));
app.listen(5000);

setInterval(() => {
	const filesReadyToUpload = getFilesReadyToUpload(VIDEOS_DIR);
	const uploadedFiles = getUploadedFiles();
	const filesToUpload = R.difference(filesReadyToUpload, uploadedFiles);

	filesToUpload.forEach(file => {
		const videoInfo = parseVideoInfoFromFileName(file);
		uploadVideo(file, videoInfo);
	});
}, 1000);
