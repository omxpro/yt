#!/usr/bin/env node

const program = require('commander');
const {uploadVideo, isUploadInProgress, getUploadedVideos} = require('../src/videoUploader');
const {getVideosReadyToUpload, parseVideoInfoFromFileName} = require('../src/fileHandler');
const initHttpInterface = require('../src/httpInterface');
const R = require('ramda');
const VIDEOS_DIR = './';
const Jsonfile = require('jsonfile');

program
	.version('0.0.1', '-v, --version')
	.usage('[options]')
	.option('-p, --port [port]', 'Port', /\d+/, 80)
	.option('-c, --config [file]', 'Config file', /\w+/, './settings.json')
	.option('--host [host]', 'Hostname', /.+/, 'localhost')
	.parse(process.argv);

initHttpInterface('http', program.host, program.port);

setInterval(() => {
	const videosReadyToUpload = getVideosReadyToUpload(VIDEOS_DIR);
	const uploadedVideos = getUploadedVideos();
	const videosToUpload = R.difference(videosReadyToUpload, uploadedVideos);

	if (videosToUpload.length > 0) {
		const video = videosToUpload[0];
		const videoInfo = parseVideoInfoFromFileName(video)
		const config = Jsonfile.readFileSync(program.config);

		if (!isUploadInProgress()) {
			uploadVideo(video, {
				title       : config.titlePrefix + ' ' + videoInfo.title,
				description : config.description,
				tags        : R.union(videoInfo.tags, config.tags)
			});
		}
	}
}, 5000);
