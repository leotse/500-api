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

auth.login = function(req, res) {

	if(helpers.isLoggedIn(req)) {
		// res.send('user already logged in!');
		// test the token with a simple call to get current user
		fpx.users(req.session, function(err, user) {
			if(err) helpers.sendError(res, err);
			else res.send(user);
		});
	} else {
		fpx.authorize(req, res);
	}	
};


/////////////////
// GET /logout //
/////////////////

auth.logout = function(req, res) {

	req.session.destroy();
	res.redirect('/');

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

			// test the token with a simple call to get current user
			fpx.users(req.session, function(err, user) {
				if(err) helpers.sendError(res, err);
				else res.send(user);
			});
		}
	});
};


// export routes
module.exports = auth;