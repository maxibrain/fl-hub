var https = require('https');
var url = require('url');
var objectMapper = require('object-mapper');
var Profile = require('./domain/profile');
var Job = require('./domain/job');
var JobPaymentBasis = require('./domain/job-payment-basis');
var JobBudget = require('./domain/job-budget');

var Api = function(config) {
    this.config = config;

    this._getOptions = function (options) {
        var path = options.path;
        if (options.query) {
            var urlObj = url.parse(path, true, false);
            urlObj.query = options.query;
            delete urlObj.search;
            path = url.format(urlObj);
        }
        return {
            hostname: 'www.freelancer.com',
            port: 443,
            method: options.method || 'GET',
            path: path,
            headers: { 'Freelancer-Developer-Auth-V1': this.config.accessToken + ';' + this.config.accessSecret },
        }
    };

    this._getJson = function(options, callback) {
        var reqOptions = this._getOptions(options);
        var req = https.request(reqOptions, (res) => {
            var body = '';

            res.on('data', function (chunk) {
                body += chunk;
            });

            res.on('end', function () {
                //console.log(body);
                var response = JSON.parse(body);
                if (response.status === "success") {
                    callback(null, response.result);
                } else {
                    callback(new Error(response.message));
                }
            });
        });
        req.end();

        req.on('error', (e) => {
            callback(e);
        });
        return req;
    }
     
    this.setAccessToken = function(accessToken, accessSecret, callback) {
        this.config.accessToken = accessToken;
        this.config.accessSecret = accessSecret;
        callback();
    };

    this.getAuthorizationUrl = function (callbackUrl, callback) {
        var urlObj = url.parse(callbackUrl, true, false);
        urlObj.query["oauth_token"] = "fake-request-token";
        urlObj.query["oauth_verifier"] = "fake-verifier";
        delete urlObj.search;
        callback(null, url.format(urlObj), "fake-request-token", "fake-request-token-secret");
    };

    this.getAccessToken = function (requestToken, requestTokenSecret, verifier, callback) {
        if (requestToken === "fake-request-token" &&
            requestTokenSecret === "fake-request-token-secret" &&
            verifier === "fake-verifier") {
            callback(null, this.config.developerId, this.config.developerKey);
        } else {
            callback(new Error("Invalid auth data"));
        }
    };

    this.getJobs = function (settings, callback) {
        return this._getJson({ path: "/api/projects/0.1/projects/active", query: settings }, callback);
    }

    this.getUserInfo = function(settings, callback) {
        return this._getJson({ path: "/api/users/0.1/users/self/", query: settings }, callback);
    }
}

var FreelancerProvider = exports = module.exports = function (session) {
    this.name = "freelancer";
    this.config = {
        'developerId': '190',
        'developerKey': 'FLN6PQ8KIFBAD22KNSTH39YK83DEC57K',
    };

    this.api = new Api(this.config);

    if (session) {
        this.api.setAccessToken(session.accessToken, session.accessTokenSecret, function () { });
    }
}

FreelancerProvider.prototype.getAuthorizationUrl = function (callbackUrl, callback) {
    this.api.getAuthorizationUrl(callbackUrl, function (error, url, requestToken, requestTokenSecret) {
        if (error) {
            callback(error);
        } else {
            callback(error, { url: url, requestToken: requestToken, requestTokenSecret: requestTokenSecret });
        }
    });
}

FreelancerProvider.prototype.authorize = function (session, token, verifier, callback) {
    if (!session || !session.requestToken || !session.requestTokenSecret) throw new Error("No OAuth session.");
    if (!verifier) throw new Error("No verifier.");
    if (session.requestToken !== token) throw new Error("Token mismatch.");
    this.api.getAccessToken(session.requestToken, session.requestTokenSecret, verifier, function (error, accessToken, accessTokenSecret) {
        if (error) {
            callback(error);
        } else {
            callback(error, {
                requestToken: session.requestToken,
                requestTokenSecret: session.requestTokenSecret,
                accessToken: accessToken,
                accessTokenSecret: accessTokenSecret
            });
        }
    });
}

FreelancerProvider.prototype.getJobs = function (settings, callback) {
    var self = this;
    settings = settings || { };
    settings.paging = settings.paging || { offset: 0, limit: 10 };
    settings.skills = settings.skills || [];
    var searchSettings = {
        //query: settings.query,
        user_details: true,
        job_details: true,
        full_description: true,
        offset: settings.paging.offset || 0,
        limit: settings.paging.limit || 10
    };
    this.api.getJobs(searchSettings, function (error, data) {
        if (error) {
            callback(error);
            return;
        }
        var projects = data.projects;
        var jobs = [];
        for (var i = 0; i < projects.length; i++) {
            projects[i].client = data.users[projects[i].owner_id];

            var job = new Job();
            job.provider = self.name;
            job.url = "https://www.freelancer.com/projects/" + projects[i].seo_url;
            job.dateCreated = projects[i].submitdate;
            job.title = projects[i].title;
            job.description = projects[i].description;
            job.paymentBasis = projects[i].type === "fixed" ? JobPaymentBasis.FIXED : JobPaymentBasis.HOURLY;
            job.budget.minimum = projects[i].budget.minimum;
            job.budget.maximum = projects[i].budget.maximum;
            var exchangeRate = projects[i].currency.exchange_rate;
            if (job.budget.minimum) job.budget.minimum = Math.round(job.budget.minimum * exchangeRate);
            if (job.budget.maximum) job.budget.maximum = Math.round(job.budget.maximum * exchangeRate);
            job.client.paymentVerified = projects[i].client.status.payment_verified;
            job.client.country = projects[i].client.location.country.name;
            job.isFavorite = false;
            job.sourceJobJSON = JSON.stringify(projects[i]);
            jobs.push(job);
        }
        callback(error, jobs);
    });
}

FreelancerProvider.prototype.getProfile = function(callback) {
    var self = this;
    var settings = { jobs : true }
    this.api.getUserInfo(settings, function(error, data) {
        if (error) {
            callback(error);
            return;
        }
        var profile = new Profile(self.name);
        objectMapper(data, profile, FreelancerProvider.ProfileMap);
        callback(error, profile);
    });
}

FreelancerProvider.ProfileMap = {
    "id": "id",
    "first_name": "name.firstName",
    "last_name": "name.lastName",
    "jobs": "skills"
}