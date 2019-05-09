var DefaultScoreCalculator = require('./score-calculator');

var UserFeed = exports = module.exports = function(db, user, scoreCalculator) {
    this.scoreCalculator = scoreCalculator || new DefaultScoreCalculator();
    this.db = db;
    this.user = user;
}

UserFeed.prototype.fetch = function (feed, settings, callback) {
    var self = this;
    if (!feed) throw new Error("Feed is undefined");
    feed.fetch(settings, function (error, jobs) {
        if (error) {
            callback(error);
            return;
        }
        self.process(jobs, callback);
    });
};

UserFeed.prototype.process = function (jobs, callback) {
    var self = this;
    this.db.get('criterias').find({ userId: this.user._id }, function (error, criterias) {
        if (error) {
            callback(error);
            return;
        }
        for (var i = jobs.length - 1; i >= 0; i--) {
            self.scoreCalculator.calculate(jobs[i], criterias);
            //if (settings.filter && !settings.filter(jobs[i])) {
            //    jobs.splice(i, 1);
            //}
        }
        callback(null, jobs);
    });
}