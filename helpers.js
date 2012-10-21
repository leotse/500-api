/////////////
// Helpers //
/////////////

var helpers = {};


// helper to check if the current user is logged in
helpers.isLoggedIn = function(req) {

	var session = req.session;
	if(session && session.token && session.secret) { 
		return true;
	}
	return false;
};


// helper to check api call response errors
helpers.canContinue = function(res, e, r) {

	if(e) helpers.sendError(res, e);
	else if(r.statusCode !== 200) helpers.sendError(res, new Error('status: ' + r.statusCode));
	else return true;
	return false;
};


// a consistent way to return an error
helpers.sendError = function(res, err) {

	res.send('error occured - ' + err);

};



// export helpers
module.exports = helpers;