///////////////////////
// 500px API Wrapper //
///////////////////////
// assumes express is used + session is setup properly

// dependencies
var qs = require('querystring')
,	request = require('request')
,	util = require('util')
,	helpers = require('./helpers')
,	config = require('./config').fpx;


// api base url
var BASE_URL = "https://api.500px.com/v1";

// oauth endpoints
var REQUEST_TOKEN_URL = BASE_URL + "/oauth/request_token";
var AUTHORIZE_URL = BASE_URL + "/oauth/authorize?oauth_token=%s";
var ACCESS_TOKEN_URL = BASE_URL + "/oauth/access_token";

// user endpoints
// photo endpoints
// blog endpoints
// collection endpoints
// and more...


// namespace
var fpx = {};


// method to authorize user against 500px
fpx.authorize = function(req, res) {

	// step 1 - get requst token
	var url = REQUEST_TOKEN_URL
	,	oauth = {
			callback: config.callback,
			consumer_key: config.key,
			consumer_secret: config.secret
		};

	request.post({ url: url, oauth: oauth }, function(e, r, body) {
		if(helpers.canContinue(res, e, r)) {

			// parse the response body in query string format
			var params = qs.parse(body)
			,	token = params.oauth_token
			,	secret = params.oauth_token_secret;

			// store the oauth token in session
			req.session.secret = secret;

			// redirect user to 500px authorize page
			var url = util.format(AUTHORIZE_URL, token);
			res.redirect(url);
		}
	});
};


// method to exchange request token for an access token
// this method should be called on the 500px oauth callback
fpx.getToken = function(req, res, callback) {
	var query = req.query
	,	token = query.oauth_token
	,	verifier = query.oauth_verifier
	,	secret = req.session.secret;

	var url = ACCESS_TOKEN_URL
	,	oauth = {
			consumer_key: config.key,
			consumer_secret: config.secret,
			token: token,
			token_secret: secret,
			verifier: verifier
		};

	request.post({ url: url, oauth: oauth }, function(e, r, body) {
		if(helpers.canContinue(res, e, r)) {

			// parse response body
			var params = qs.parse(body)
			,	token = params.oauth_token
			,	secret = params.oauth_token_secret;

			// put token and secret in session
			req.session.token = token;
			req.session.secret = secret;

			callback(null);
		}
	});
}




// export
module.exports = fpx;