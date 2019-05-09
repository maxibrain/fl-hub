var ScoreCalculator = exports = module.exports = function() {
}

ScoreCalculator.prototype.calculate = function (job, criterias) {
    var defaultCriterias = [
        {
            name: "Top Country",
            expression: "job.client && job.client.country && ['United States', 'Canada', 'Australia'].indexOf(job.client.country) > -1",
            multiplier: 2.0
        },
        {
            name: "Trusted Country",
            expression: "job.client && job.client.country && ['United Kingdom', 'Germany', 'Sweden', 'Finland', 'Norway'].indexOf(job.client.country) > -1",
            multiplier: 1.5
        },
        {
            name: "Untrusted Country",
            expression: "job.client && job.client.country && ['Pakistan', 'India', 'Kenya'].indexOf(job.client.country) > -1",
            multiplier: 0.0
        },
        {
            name: "Verified Payment",
            expression: "job.client && job.client.payment_verification_status === 'VERIFIED'",
            multiplier: 1.2
        },
        {
            name: "Unverified Payment",
            expression: "!job.client || job.client.payment_verification_status !== 'VERIFIED'",
            multiplier: 0.8
        },
        {
            name: "High Fixed Budget",
            expression: "job.job_type === 'Fixed' && job.budget && job.budget >= 5000",
            multiplier: 2.0
        },
        {
            name: "Middle Fixed Budget",
            expression: "job.job_type === 'Fixed' && job.budget && job.budget >= 2000 && job.budget < 5000",
            multiplier: 1.5
        },
        {
            name: "Not my skills",
            expression: "job.skills.indexOf('article-writing') > -1 " +
                "|| job.skills.indexOf('internet-research') > -1 " +
                "|| job.skills.indexOf('medical-law') > -1 " +
                "|| job.skills.indexOf('medical-writing') > -1 ",
            multiplier: 0.0
        }
    ];
    
    criterias = criterias || defaultCriterias;
    var totalScore = 1.0;
    job.scores = [];
    for (var j = 0; j < criterias.length; j++) {
        var criteria = criterias[j];
        var expression = criteria.expression;
        var evals = eval(expression);
        if (evals) {
            job.scores.push({
                name : criteria.name,
                score : criteria.multiplier,
                icon: criteria.icon,
                showName: criteria.showName,
            });
            totalScore *= criteria.multiplier;
            if (totalScore === 0)
                break;
        }
    }
    job.totalScore = totalScore;
};