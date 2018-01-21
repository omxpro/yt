module.exports = function(data) {
	return `<!DOCTYPE html>
		<html>
			<head>
				<title></title>
			</head>
			<body>
				<a href="${data.authUrl}">Click here to authenticate</a>
				<p>Upload in progress: ${data.isUploadInProgress ? 'yes' : 'no'}</p>
				<p>Error: ${data.error}</p>
				<h2>Videos uploading to the server:</h2>
				<ul>
					${ data.videosNotReady.map((video) => `<li>${video}</li>`) }
				</ul>
				<h2>Videos in the queue:</h2>
				<ul>
					${ data.videosToUpload.map((video) => `<li>${video}</li>`) }
				</ul>
				<h2>Uploaded videos:</h2>
				<ul>
					${ data.uploadedVideos.map((video) => `<li>${video} [<a href="/remove?video=${video}">Reupload</a>]</li>`) }
				</ul>
			</body>
		</html>`;
};
