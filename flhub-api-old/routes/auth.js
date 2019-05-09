var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/:provider', function(req, res, next) {
	if (!req.params.provider) {
		next();
		return;
    }
    delete req.session[providerName];
    if (req.query.revoke || req.query.revoke === '') {
        var userCollection = req.db.get('users');
        userCollection.updateById(req.user._id, req.user, function (error) {
            if (error) {
                next();
                return;
            }
            res.redirect(req.query.returnUrl || '/account');
        });
    } else {
        var providerName = req.params.provider.toLowerCase();
        if (req.user) {
            delete req.user[req.params.provider];
        }
        var Provider;
        try {
            Provider = require('../models/provider.' + providerName + '.js');
        } catch (e) {
            next();
            return;
        }
        var provider = new Provider();
        var callbackUrl = req.fullUrl.replace("/" + req.params.provider, "/" + req.params.provider + "/callback");
        provider.getAuthorizationUrl(callbackUrl, function(error, session) {
            if (error) {
                next(error);
                return;
            }
            req.session[providerName] = session;
            res.redirect(session.url);
        });
    }
});

router.get('/:provider/callback', function(req, res, next) {
	if (!req.params.provider) {
		next();
		return;
	}
	var providerName = req.params.provider.toLowerCase();
	var token = req.query["oauth_token"];
	var verifier = req.query["oauth_verifier"];
	
	if (!req.session[providerName] || !token || !verifier || req.session[providerName].requestToken !== token) {
		res.status(400).end();
		return;
	}
	
	var Provider;
	try {
		Provider = require('../models/provider.' + providerName + '.js');
	} catch (e) {
		next();
		return;
	}
    var provider = new Provider();

    var sendResponse = function (err) {
        if (err) { return next(err); }
        return res.redirect(req.query["returnUrl"] || '/');
    }
    
    var userCollection = req.db.get('users');

    var getProfile = function (session, callback)
    {
        var authedProvider = new Provider(session);
        return authedProvider.getProfile(function (err, profile) {
            session.profile = profile;
            return callback(err, session);
        });
    }

    var getUser = function (session, callback) {
        var filter = {};
        filter[providerName + ".profile.id"] = session.profile.id;
        return userCollection.findOne(filter, function (error, user) {
            var checkedUser = user || new User();
            checkedUser[providerName] = session;
            return callback(error, checkedUser);
        });
    }

    var checkLogin = function (user, callback) {
        if (!user) {
            return callback(new Error("No user"));
        }
        if (req.user && user._id && req.user._id !== user._id) {
            return callback(new Error("Users mismatch"));
        }
        if (req.user) {
            req.user[providerName] = user[providerName];
            return callback(null, req.user);
        } else {
            return req.login(user, function(err) {
                return callback(err, user);
            });
        }
    }

    var upsertUser = function(user, callback) {
        return userCollection.update(user._id, user, { upsert: true }, callback);
    };

	provider.authorize(req.session[providerName], token, verifier, function(err, session) {
        if (err) return sendResponse(error);
        delete req.session[providerName];
	    return getProfile(session, function(err, session) {
	        if (err) return sendResponse(err);
	        return getUser(session, function(err, user) {
                if (err) return sendResponse(err);
	            return checkLogin(user, function(err, user) {
                    if (err) return sendResponse(err);
	                return upsertUser(user, function(err, user) {
	                    return sendResponse(err, user);
	                });
	            });
	        });
	    });
	});
});

module.exports = router;
