var express = require('express');
var router = express.Router();
var Provider = require('../models/provider');
var Feed = require('../models/feed');
var UserFeed = require('../models/user-feed');

/* GET home page. */
router.get('/', function (req, res, next) {
    var query = req.query.query || "*";
    var count = req.query.count || 20;
    var scoreThreashold = req.query.scoreThreashold || 0;
    var settings = {
        query: query,
        count: count,
        filter: function (job) { return true; },
        //filter: function (job) { return job.totalScore > scoreThreashold; },
    };
    var provider = new Provider(req.user);
    var feed = new Feed(provider);
    var userFeed = new UserFeed(req.db, req.user);
    userFeed.fetch(feed, settings, function (error, data) {
        if (error) return next(error);
        data.sort(function (a, b) { return b.totalScore - a.totalScore; });
        res.render('jobs', { title: 'Jobs', jobs: data, user: req.user, query: req.query });
    });
});

router.post('/rate', function (req, res, next) {
    
});

module.exports = router;
