var async = require('async');

var Provider = exports = module.exports = function (session, names) {
	this.providers = {};
	var pNames = names || ["upwork", "freelancer"];
	for (var i = 0; i < pNames.length; i++) {
		var InnerProvider = require('./provider.' + pNames[i]);
		this.providers[pNames[i]] = new InnerProvider(session[pNames[i]]);
	}
}

Provider.prototype.getJobs = function(settings, callback) {
    var result = { jobs: [], errors: [] }
    async.each(Object.keys(this.providers),
        (providerName, callback) => {
            console.log("Getting jobs for provider '" + providerName + "'");
            var provider = this.providers[providerName];
            provider.getJobs(settings, (error, data) => {
                if (error) {
                    console.log("Failed to get jobs for provider '" + provider.name + "': '" + error + "'");
                    result.errors.push({ provider: provider.name, error: error });
                    callback();
                    return;
                }
                console.log("Got jobs for provider '" + provider.name + "': " + ((data && data.length) || 0).toString());
                data.forEach(j => result.jobs.push(j));
                callback();
            });
        },
        error => {
            if (error) {
                callback(error);
                return;
            }
            result.jobs.sort((a, b) => b.dateCreated - a.dateCreated);
            callback(error, result);
        }
    );
}

module.exports = Provider;