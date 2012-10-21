///////////////////////////
// Authentication Routes //
///////////////////////////
var auth = {};


// denpedencies
var qs = require('querystring')
,	request = require('request')
,	config = require('../config').fpx
,	helpers = require('../helpers');


var dasecret = null;

////////////////
// GET /login //
////////////////
// returns the login page

auth.index = function(req, res) {

	var url = 'https://api.500px.com/v1/oauth/request_token'
	,	oauth = {
			callback: config.callback,
			consumer_key: config.key,
			consumer_secret: config.secret
		};

	request.post({ url: url, oauth: oauth }, function(e, r, body) {
		if(helpers.checkErrors(res, e, r)) {

			// parse the response body in query string format
			var params = qs.parse(body)
			,	token = params.oauth_token
			,	secret = params.oauth_token_secret;

			dasecret = secret;

			// redirect user to 500px authorize page
			var url = 'https://api.500px.com/v1/oauth/authorize?oauth_token=' + token;
			res.redirect(url);
		}
	});
};


/////////////////////////
// GET /login/callback //
/////////////////////////
// user authorization callback

auth.callback = function(req, res) {
	var query = req.query
	,	token = query.oauth_token
	,	verifier = query.oauth_verifier;

	var url = "https://api.500px.com/v1/oauth/access_token"
	,	oauth = {
			consumer_key: config.key,
			consumer_secret: config.secret,
			token: token,
			token_secret: dasecret,
			verifier: verifier
		};

	request.post({ url: url, oauth: oauth }, function(e, r, body) {
		if(helpers.checkErrors(res, e, r)) {

			// parse response body
			var params = qs.parse(body)
			,	token = params.oauth_token
			,	secret = params.oauth_token_secret;

			// test the token
			var url = 'https://api.500px.com/v1/photos/12226767'
			,	oauth = {
					consumer_key: config.key,
					consumer_secret: config.secret,
					token: token,
					token_secret: secret,
				};

			request.get({ url: url, oauth: oauth, json: true }, function(e, r, body) {
				if(helpers.checkErrors(res, e, r)) {

					// finally no errors! just send the response body for now
					res.send(body);
				}
			});
		}
	});
};


// export routes
module.exports = auth;