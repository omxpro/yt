#!/usr/bin/env node

const program = require('commander');
const {uploadVideo, isUploadInProgress, getUploadedVideos} = require('../src/videoUploader');
const {getVideosReadyToUpload, parseVideoInfoFromFileName} = require('../src/fileHandler');
const initHttpInterface = require('../src/httpInterface');
const R = require('ramda');
const VIDEOS_DIR = './';

program
	.version('0.0.1', '-v, --version')
	.usage('[options]')
	.option('-p, --port [port]', 'Port', /\d+/, 80)
	.option('-c, --config [file]', 'Config file', './settings.json')
	.parse(process.argv);

initHttpInterface(program.port);

setInterval(() => {
	const videosReadyToUpload = getVideosReadyToUpload(VIDEOS_DIR);
	const uploadedVideos = getUploadedVideos();
	const videosToUpload = R.difference(videosReadyToUpload, uploadedVideos);

	if (videosToUpload.length > 0) {
		const video = videosToUpload[0];
		const videoInfo = parseVideoInfoFromFileName(video)

		if (!isUploadInProgress()) {
			uploadVideo(video, videoInfo);
		}
	}
}, 1000);
