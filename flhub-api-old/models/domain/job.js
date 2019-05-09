var JobPaymentBasis = require('./job-payment-basis');
var JobBudget = require('./job-budget');
var Client = require('./client');

var Job = exports = module.exports = function (provider) {
    this.provider = provider || "UNKNOWN";
    this.url = "";
    this.dateCreated = undefined;
    this.title = "";
    this.description = "";
    this.categories = [];
    this.skills = [];
    this.paymentBasis = JobPaymentBasis.HOURLY;
    this.budget = new JobBudget();
    this.client = new Client();
    this.liked = false;
    this.disliked = false;
    this.isFavorite = false;
    this.totalScore = 1.0;
    this.sourceJobJSON = undefined;
}
