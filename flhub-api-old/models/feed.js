var Feed = exports = module.exports = function(provider) {
	if (!provider) throw new Error("No provider");
	this.provider = provider;
}

Feed.prototype.fetch = function (settings, callback) {
    var self = this;
    var page = 0;
    var jobs = [];
    var getJobsCallback = function (error, result) {
        // server_time
        if (error) {
            console.log(error);
            callback(error);
            return;
        }
        
        var stopFetching = true;
        if (result && result.jobs && result.jobs.length > 0) {
            if (settings.latestJobId) {
                for (var i = 0; i < result.jobs.length; i++) {
                    if (result.jobs[i].id === settings.latestJobId) {
                        result.jobs.splice(i, result.jobs.length - i); // remove old jobs
                        break;
                    }
                }
            }
            
            jobs = jobs.concat(result.jobs);
            
            if (!settings.latestJobId && settings.count && jobs.length < settings.count) {
                stopFetching = false;
            }
        }
        if (stopFetching) {
            //jobs.sort(function(a, b) { return b.totalScore - a.totalScore; });
            callback(error, jobs);
        } else {
            page++;
            settings.paging = { offset: page * 10, limit: 10 };
            self.provider.getJobs(settings, getJobsCallback);
        }
    };
    
    self.provider.getJobs(settings, getJobsCallback);
};