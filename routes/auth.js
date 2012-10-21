///////////////////////////
// Authentication Routes //
///////////////////////////
var auth = {};


// denpedencies
var qs = require('querystring')
,	request = require('request')
,	config = require('../config').fpx
,	helpers = require('../helpers')
,	fpx = require('../500px');


////////////////
// GET /login //
////////////////
// authorizes the user against 500px

auth.index = function(req, res) {

	// authorize user
	fpx.authorize(req, res);
};


/////////////////////////
// GET /login/callback //
/////////////////////////
// oauth user callback

auth.callback = function(req, res) {

	// get the access token
	fpx.getToken(req, res, function(err) {

		if(err) helpers.sendError(res, err);
		else {

			// test the token with a user call
			var url = 'https://api.500px.com/v1/users'
			,	token = req.session.token
			,	secret = req.session.secret
			,	oauth = {
					consumer_key: config.key,
					consumer_secret: config.secret,
					token: token,
					token_secret: secret,
				};

			request.get({ url: url, oauth: oauth, json: true }, function(e, r, body) {
				if(helpers.canContinue(res, e, r)) {

					// finally no errors! just send the response body for now
					res.send(body);
				}
			});
		}
	});
};


// export routes
module.exports = auth;