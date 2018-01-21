#!/usr/bin/env node

const {uploadVideo, getUploadStatus, isUploadInProgress, getUploadedVideos,
	getError, removeUploadedVideo} = require('./videoUploader');
const {getVideosReadyToUpload,parseVideoInfoFromFileName,
	getVideosNotReady} = require('./fileHandler');
const {getAuthToken, generateAuthUrl, getOauth} = require('./authenticator');
const generateFrontEnd = require('./frontEnd');
const R = require('ramda');
const express = require('express');
const VIDEOS_DIR = './videos';
const app = express();
const oauth = getOauth();
const authUrl = generateAuthUrl(oauth);

app.get('/', (req, res) => {
	const videosReadyToUpload = getVideosReadyToUpload(VIDEOS_DIR);
	const uploadedVideos = getUploadedVideos();
	const videosToUpload = R.difference(videosReadyToUpload, uploadedVideos);

	res.send(generateFrontEnd({
		isUploadInProgress : isUploadInProgress(),
		error              : getError(),
		authUrl            : authUrl,
		getVideosNotReady  : getVideosNotReady(VIDEOS_DIR),
		uploadedVideos     : uploadedVideos,
		videosToUpload     : videosToUpload
	}));
});

app.get('/remove', (req, res) => {
	removeUploadedVideo(req.query.video);
	req.xhr ? res.json({success : true}) : res.redirect('/');
});

app.get('/oauth2callback', (req, res) => {
	getAuthToken(oauth, req.query.code).then(() => {
		res.redirect('/');
	}).catch(() => {
		res.send('Authentication failed. Try with this: ', generateAuthUrl(oauth));
	});
});

app.listen(5000);

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
