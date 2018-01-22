const Jsonfile = require('jsonfile');
const Youtube = require('youtube-api');

const CREDENTIALS_FILE = './credentials.json';

module.exports.getOauth = function(redirectUrl) {
	this.credentials = Jsonfile.readFileSync(CREDENTIALS_FILE);

	return Youtube.authenticate({
		type          : 'oauth',
		client_id     : this.credentials.web.client_id,
		client_secret : this.credentials.web.client_secret,
		redirect_url  : redirectUrl
	});
};

module.exports.generateAuthUrl = function(oauth) {
	return oauth.generateAuthUrl({
		access_type : 'offline',
		scope       : ['https://www.googleapis.com/auth/youtube.upload']
	});
};

module.exports.getAuthToken = function(oauth, code) {
	return new Promise((resolve, reject) => {
		oauth.getToken(code, (err, tokens) => {
			if (err) {
				console.log('token error', err);
				reject();
			}

			oauth.setCredentials(tokens);
			resolve();
		});
	});
};
